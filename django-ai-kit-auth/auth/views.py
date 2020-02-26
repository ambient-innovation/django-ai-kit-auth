from django.conf import settings
from django.contrib.auth.password_validation import (
    get_password_validators,
    validate_password,
)
from django.core.exceptions import ValidationError as DjangoValidationError
from rest_framework import status, generics
from rest_framework.response import Response
from rest_framework.exceptions import ValidationError
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.authentication import JWTAuthentication
from . import serializers


class LoginView(generics.GenericAPIView):
    # uses standard user model
    serializer_class = serializers.LoginSerializer
    permission_classes = (AllowAny,)

    def post(self, request, *args, **kwargs):
        self.request = request
        self.serializer = self.get_serializer(
            data=self.request.data, context={"request": request}
        )
        self.serializer.is_valid(raise_exception=True)

        self.user = self.serializer.validated_data["user"]

        self.refresh_token = RefreshToken.for_user(self.user)

        data = {
            "user": self.user.username,
            "refresh": str(self.refresh_token),
            "access": str(self.refresh_token.access_token),
        }
        response = Response(data, status=status.HTTP_200_OK)

        return response


class Me(generics.GenericAPIView):
    """
    Barebones user model detail view
    """

    authentication_classes = (JWTAuthentication,)
    permission_classes = (IsAuthenticated,)

    def get(self, request, *args, **kwargs):
        data = {"username": request.user.username, "email": request.user.email}
        response = Response(data, status=status.HTTP_200_OK)
        return response


class ValidatePassword(generics.GenericAPIView):
    """
    Endpoint to validate the password without trying to register an account.
    Can be used to show the user error messages on the fly
    """

    permission_classes = (AllowAny,)

    def post(self, request, *args, **kwargs):
        try:
            validators = get_password_validators(settings.AUTH_PASSWORD_VALIDATORS)
        except:
            validators = None
        try:
            validate_password(
                request.data["password"],
                user=request.data["user"],
                password_validators=validators,
            )
        except DjangoValidationError as e:
            raise ValidationError(e.error_list)
        return Response({}, status=status.HTTP_200_OK)
