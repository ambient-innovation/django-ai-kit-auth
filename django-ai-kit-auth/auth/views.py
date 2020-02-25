from rest_framework import viewsets, status, generics
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.tokens import RefreshToken

from . import models, serializers


class LoginView(generics.GenericAPIView):
    # uses standard user model
    #
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
