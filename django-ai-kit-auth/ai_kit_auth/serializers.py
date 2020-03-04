from django.contrib.auth import authenticate
from django.conf import settings
from rest_framework import serializers
from rest_framework.exceptions import ValidationError


class LoginSerializer(serializers.Serializer):
    email_or_username = serializers.CharField(required=True)
    password = serializers.CharField(style={"input_type": "password"})

    def validate(self, attrs):
        ident = attrs.get("email_or_username")
        password = attrs.get("password")

        # try to log in with email
        user = authenticate(self.context["request"], email=ident, password=password)
        if not user:
            # try again with username
            user = authenticate(
                self.context["request"], username=ident, password=password
            )
        if not user:
            # still no luck, must be bogus credentials
            raise ValidationError("invalid_credentials")

        attrs["user"] = user
        return attrs
