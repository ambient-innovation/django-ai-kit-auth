import unicodedata
import uuid
from django.contrib.auth import authenticate, get_user_model, tokens
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


def raise_validation(error_code):
    raise ValidationError(error_code, code=error_code)


class LoginSerializer(serializers.Serializer):
    ident = serializers.CharField(**FIELD_ARGS, write_only=True)
    password = serializers.CharField(
        style={"input_type": "password"},
        **FIELD_ARGS,
        write_only=True,
    )

    def validate(self, attrs):
        ident = attrs.get("ident")
        password = attrs.get("password")
        # if the ident is an email, we have to map it to a username
        try:
            ident = UserModel.objects.get(
                **{
                    f"{UserModel.get_email_field_name()}__iexact": ident,
                }
            ).get_username()
        except UserModel.DoesNotExist:
            pass

        user = authenticate(self.context["request"], username=ident, password=password)

        if not user:
            raise_validation("invalid_credentials")

        attrs["user"] = user
        return attrs


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserModel
        fields = ["id", UserModel.get_email_field_name(), UserModel.USERNAME_FIELD]


class ValidatePasswordSerializer(serializers.Serializer):
    # either ident or email and username (only if configured) is required,
    # but we test that manually
    ident = serializers.CharField(required=False, write_only=True)
    username = serializers.CharField(required=False, allow_blank=True, write_only=True)
    email = serializers.EmailField(required=False, allow_blank=True, write_only=True)
    password = serializers.CharField(
        required=True,
        error_messages={"required": "required", "blank": "blank"},
        write_only=True,
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
                raise_validation("unknown_user")
        else:
            # usermodel does not already exist, we create a one off only for the
            # validation
            user = UserModel(
                **{
                    UserModel.USERNAME_FIELD: username,
                    UserModel.get_email_field_name(): email,
                }
            )

        try:
            validators = get_password_validators(settings.AUTH_PASSWORD_VALIDATORS)
        except:
            return attrs
        try:
            validate_password(
                password=password,
                user=user,
                password_validators=validators,
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


class ActivateUserSerializer(serializers.Serializer):
    ident = serializers.CharField(**FIELD_ARGS, write_only=True)
    token = serializers.CharField(**FIELD_ARGS, write_only=True)


class InitiatePasswordResetSerializer(serializers.Serializer):
    email = serializers.EmailField(**FIELD_ARGS, write_only=True)


class PasswordResetSerializer(serializers.Serializer):
    ident = serializers.CharField(**FIELD_ARGS, write_only=True)
    token = serializers.CharField(**FIELD_ARGS, write_only=True)
    password = serializers.CharField(**FIELD_ARGS, write_only=True)


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
            raise ValidationError(
                {
                    "password": [
                        ErrorDetail(error.code, code=error.code)
                        for error in e.error_list
                    ]
                }
            )

        # make sure email is unique
        if UserModel.objects.filter(
            **{UserModel.get_email_field_name(): email}
        ).exists():
            code = "email_unique"
            raise ValidationError({"email": [ErrorDetail(code, code=code)]})

        user_data = {
            UserModel.USERNAME_FIELD: username,
            UserModel.get_email_field_name(): email,
            "is_active": False,
        }
        try:
            user = UserModel(**user_data)
            user.set_password(password)
            user.save()
            user_post_registered.send(sender=RegistrationSerializer, user=user)
        except IntegrityError:
            code = "username_unique"
            raise ValidationError({"username": [ErrorDetail(code, code=code)]})
        services.send_user_activation_mail(user)
        return attrs
