from django.contrib.auth import login, logout, get_user_model, tokens
from rest_framework import status, generics, views
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from . import serializers, services
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


class ValidatePassword(views.APIView):
    """
    Endpoint to validate the password without trying to register an account.
    Can be used to show the user error messages on the fly
    """

    serializer_class = serializers.ValidatePasswordSerializer
    permission_classes = (AllowAny,)

    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        return Response({}, status=status.HTTP_200_OK)


class ActivateUser(views.APIView):
    """
    Endpoint for double opt in user activation
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


class InitiatePasswordResetView(views.APIView):
    permission_classes = (AllowAny,)

    def post(self, request, *args, **kwargs):
        try:
            user = UserModel.objects.get(email__exact=request.data["email"])
            services.send_reset_pw_mail(user)
            return Response(status=status.HTTP_200_OK)
        except UserModel.DoesNotExist:
            return Response(status=status.HTTP_400_BAD_REQUEST)


class ResetPassword(views.APIView):
    """
    Endpoint to reset the password for a user. It also activates the user if
    the active flag is not already set
    """

    serializer_class = serializers.PasswordResetSerializer
    permission_classes = (AllowAny,)

    def post(self, request, *args, **kwargs):
        ident = request.data["ident"]
        token = request.data["token"]
        password = request.data["password"]

        try:
            # we need a valid session to reset the password
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
            # if anything goes wrong, we error out
            return Response(
                {"error": "reset_password_link_invalid"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # reuse the password validation
        serializer = serializers.ValidatePasswordSerializer(
            data={"ident": user.username, "password": password}
        )
        serializer.is_valid(raise_exception=True)

        # ok, everything is fine, we do the actual password reset
        user.is_active = True
        user.set_password(password)
        user.save()
        # we also log out the user so they can log in again with their new
        # credentials
        logout(request)
        return Response({}, status=status.HTTP_200_OK)
