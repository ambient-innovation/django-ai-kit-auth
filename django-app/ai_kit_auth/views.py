from django.contrib.auth import login, logout, get_user_model, tokens
from rest_framework import status, generics, views
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from . import serializers, services
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_protect
from django.middleware import csrf

UserModel = get_user_model()


class LoginView(generics.GenericAPIView):
    # uses standard user model
    serializer_class = serializers.LoginSerializer
    permission_classes = (AllowAny,)
    user_serializer = serializers.UserSerializer

    @method_decorator(csrf_protect)
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
        csrf_token = csrf.get_token(request)
        return Response({"csrf": csrf_token}, status=status.HTTP_200_OK)


class MeView(generics.GenericAPIView):
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


class RegistrationView(generics.GenericAPIView):

    permission_classes = (AllowAny,)

    serializer_class = serializers.RegistrationSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        return Response({}, status=status.HTTP_201_CREATED)


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

    def post(self, request, *args, **kwargs):
        try:
            ident = request.data["ident"]
            token = request.data["token"]
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
        return Response(status=status.HTTP_200_OK)


class InitiatePasswordResetView(views.APIView):
    permission_classes = (AllowAny,)

    def post(self, request, *args, **kwargs):
        try:
            user = UserModel.objects.get(email__iexact=request.data["email"])
            services.send_reset_pw_mail(user)
        except UserModel.DoesNotExist:
            pass
        # always return OK
        return Response(status=status.HTTP_200_OK)


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
            data={"ident": ident, "password": password,}
        )
        serializer.is_valid(raise_exception=True)

        # ok, everything is fine, we do the actual password reset
        user.is_active = True
        user.set_password(password)
        user.save()
        return Response({}, status=status.HTTP_200_OK)
