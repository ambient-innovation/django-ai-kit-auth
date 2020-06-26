import unicodedata
import uuid
from django.contrib.auth import authenticate, get_user_model
from django.contrib.auth.password_validation import (
    get_password_validators,
    validate_password,
)
from django.conf import settings
from django.core.exceptions import ValidationError as DjangoValidationError
from django.db.utils import IntegrityError
from rest_framework import serializers
from rest_framework.exceptions import ValidationError, ErrorDetail
from .settings import api_settings
from .signals import user_post_registered
from . import services

UserModel = get_user_model()

# common arguments to the serializer fields
FIELD_ARGS = {
    "required": True,
    "error_messages": {"required": "required", "blank": "blank"},
}


class LoginSerializer(serializers.Serializer):
    ident = serializers.CharField(**FIELD_ARGS)
    password = serializers.CharField(style={"input_type": "password"}, **FIELD_ARGS,)

    def validate(self, attrs):
        ident = attrs.get("ident")
        password = attrs.get("password")
        # if the ident is an email, we have to map it to a username
        try:
            ident = UserModel.objects.get(email__iexact=ident).get_username()
        except UserModel.DoesNotExist:
            pass

        user = authenticate(self.context["request"], username=ident, password=password)

        if not user:
            raise ValidationError("invalid_credentials")

        attrs["user"] = user
        return attrs


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserModel
        fields = ["id", "email", "username"]


class ValidatePasswordSerializer(serializers.Serializer):
    # either ident or email and username (only if configured) is required,
    # but we test that manually
    ident = serializers.CharField(required=False)
    username = serializers.CharField(required=False, allow_blank=True)
    email = serializers.EmailField(required=False, allow_blank=True)
    password = serializers.CharField(
        required=True, error_messages={"required": "required", "blank": "blank"},
    )

    def validate(self, attrs):
        ident = attrs.get("ident")
        username = attrs.get("username")
        email = attrs.get("email")
        password = attrs["password"]

        if ident:
            # we dont need username and/or email, the usermodel should already
            # exist
            try:
                pk = services.scramble_id(ident)
                user = UserModel.objects.get(pk=pk)
            except UserModel.DoesNotExist:
                # if anything goes wrong, we error out
                raise ValidationError("unknown_user")
        else:
            # usermodel does not already exist, we create a one off only for the
            # validation
            user = UserModel(username=username, email=email,)

        try:
            validators = get_password_validators(settings.AUTH_PASSWORD_VALIDATORS)
        except:
            return attrs
        try:
            validate_password(
                password=password, user=user, password_validators=validators,
            )
        except DjangoValidationError as e:
            # convert to error codes since translations are implemented in the
            # frontend
            raise ValidationError(
                {
                    "password": [
                        ErrorDetail(error.code, code=error.code)
                        for error in e.error_list
                    ]
                }
            )
        return attrs


class InitiatePasswordResetSerializer(serializers.Serializer):
    email = serializers.EmailField(**FIELD_ARGS)


class PasswordResetSerializer(serializers.Serializer):
    ident = serializers.CharField(**FIELD_ARGS)
    token = serializers.CharField(**FIELD_ARGS)
    password = serializers.CharField(**FIELD_ARGS)


class RegistrationSerializer(serializers.Serializer):
    username = serializers.CharField(
        required=api_settings.USERNAME_REQUIRED,
        allow_blank=not api_settings.USERNAME_REQUIRED,
        error_messages=FIELD_ARGS["error_messages"],
    )
    password = serializers.CharField(**FIELD_ARGS)
    email = serializers.EmailField(**FIELD_ARGS)

    def validate(self, attrs):
        def normalize(value):
            if not value:
                value = str(uuid.uuid4())
            return unicodedata.normalize("NFKC", value)

        username = normalize(attrs.get("username"))
        email = attrs["email"]
        password = attrs["password"]

        password_serializer = ValidatePasswordSerializer(
            data={"username": username, "email": email, "password": password}
        )
        try:
            password_serializer.is_valid(raise_exception=True)
        except DjangoValidationError as e:
            # convert to error codes since translations are implemented in the
            # frontend
            raise ValidationError({"password": [error.code for error in e.error_list]})

        # make sure email is unique
        if UserModel.objects.filter(email=email).exists():
            raise ValidationError({"email": ["email_unique"]})

        try:
            user = UserModel(username=username, email=email, is_active=False)
            user.set_password(password)
            user.save()
            user_post_registered.send(sender=RegistrationSerializer, user=user)
        except IntegrityError as e:
            raise ValidationError({"username": ["username_unique"]})
        services.send_user_activation_mail(user)
        return attrs
