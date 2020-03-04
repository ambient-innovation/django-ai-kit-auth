from django.contrib.auth import authenticate, get_user_model
from rest_framework import serializers
from rest_framework.exceptions import ValidationError

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
    ident = serializers.CharField(required=True)
    password = serializers.CharField(required=True)
