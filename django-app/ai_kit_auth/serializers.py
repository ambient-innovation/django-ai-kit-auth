from django.contrib.auth import authenticate, get_user_model
from django.contrib.auth.password_validation import (
    get_password_validators,
    validate_password,
)
from django.conf import settings
from django.core.exceptions import ValidationError as DjangoValidationError
from rest_framework import serializers
from rest_framework.exceptions import ValidationError
from .settings import api_settings

UserModel = get_user_model()


class LoginSerializer(serializers.Serializer):
    ident = serializers.CharField(
        required=True, error_messages={"required": "required", "blank": "blank"}
    )
    password = serializers.CharField(
        style={"input_type": "password"},
        required=True,
        error_messages={"required": "required", "blank": "blank"},
    )

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
    username = serializers.CharField(required=api_settings.USERNAME_REQUIRED)
    email = serializers.EmailField(required=True)
    password = serializers.CharField(required=True)

    def validate(self, attrs):
        username = attrs["username"] or "na"
        email = ["email"]
        password = attrs["password"]
        try:
            validators = get_password_validators(settings.AUTH_PASSWORD_VALIDATORS)
        except:
            validators = None
        try:
            user = UserModel(username=username, email=email,)

            validate_password(
                password=password, user=user, password_validators=validators,
            )
        except DjangoValidationError as e:
            # convert to error codes since translations are implemented in the
            # frontend
            raise ValidationError([error.code for error in e.error_list])
        return attrs


class InitiatePasswordResetSerializer(serializers.Serializer):
    email = serializers.EmailField(required=True)


class PasswordResetSerializer(serializers.Serializer):
    ident = serializers.CharField(required=True)
    token = serializers.CharField(required=True)
    password = serializers.CharField(required=True)
