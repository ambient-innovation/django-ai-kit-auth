from django.contrib.auth import login, logout, get_user_model, tokens
from django.contrib.auth.password_validation import (
    get_password_validators,
    validate_password,
)
from django.core.exceptions import ValidationError as DjangoValidationError
from rest_framework import status, generics, views
from rest_framework.response import Response
from rest_framework.exceptions import ValidationError
from rest_framework.permissions import IsAuthenticated, AllowAny
from . import serializers, services
from django.conf import settings
from django.middleware import csrf

UserModel = get_user_model()


class LoginView(generics.GenericAPIView):
    # uses standard user model
    serializer_class = serializers.LoginSerializer
    permission_classes = (AllowAny,)
    user_serializer = serializers.UserSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(
            data=self.request.data, context={"request": request}
        )
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data["user"]
        login(request, user)

        user_serializer = self.user_serializer(
            instance=user, context={"request": request}
        )

        # the position of this statement is important since the csrf token
        # is rotated on login
        csrf_token = csrf.get_token(request)

        return Response(
            {"user": user_serializer.data, "csrf": csrf_token,},
            status=status.HTTP_200_OK,
        )


class LogoutView(views.APIView):
    permission_classes = (IsAuthenticated,)

    def post(self, request, *args, **kwargs):
        logout(request)
        return Response(status=status.HTTP_200_OK)


class Me(generics.GenericAPIView):
    """
    Barebones user model detail view
    """

    permission_classes = (AllowAny,)
    user_serializer = serializers.UserSerializer

    def get(self, request, *args, **kwargs):
        csrf_token = csrf.get_token(request)

        if request.user.is_anonymous:
            user_data = None
        else:
            user_serializer = self.user_serializer(
                instance=request.user, context={"request": request}
            )
            user_data = user_serializer.data
        return Response(
            {"user": user_data, "csrf": csrf_token,}, status=status.HTTP_200_OK
        )


class ValidatePassword(generics.GenericAPIView):
    """
    Endpoint to validate the password without trying to register an account.
    Can be used to show the user error messages on the fly
    """

    serializer_class = serializers.ValidatePasswordSerializer

    permission_classes = (AllowAny,)

    def get_queryset(self):
        """
        nessessary to shut drf up...
        """
        return None

    def post(self, request, *args, **kwargs):
        try:
            validators = get_password_validators(settings.AUTH_PASSWORD_VALIDATORS)
        except:
            validators = None
        try:
            validate_password(
                request.data["password"],
                user=request.data["ident"],
                password_validators=validators,
            )
        except DjangoValidationError as e:
            # convert to error codes since translations are implemented in the
            # frontend
            raise ValidationError([error.code for error in e.error_list])
        return Response({}, status=status.HTTP_200_OK)


class ActivateUser(views.APIView):
    """
    Endpoint to validate the password without trying to register an account.
    Can be used to show the user error messages on the fly
    """

    permission_classes = (AllowAny,)

    def post(self, request, ident, token, *args, **kwargs):
        try:
            pk = services.scramble_id(ident)
            user = UserModel.objects.get(pk=pk)
            assert tokens.PasswordResetTokenGenerator().check_token(user, token)
        except (
            TypeError,
            ValueError,
            OverflowError,
            AssertionError,
            UserModel.DoesNotExist,
        ):
            return Response(
                {"error": "activation_link_invalid"}, status=status.HTTP_400_BAD_REQUEST
            )
        user.is_active = True
        user.save()
        login(request, user)
        return Response(status=status.HTTP_200_OK)
