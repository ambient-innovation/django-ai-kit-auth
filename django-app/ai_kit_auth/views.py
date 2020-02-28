from datetime import datetime

from django.conf import settings
from django.contrib.auth.models import User
from rest_framework import viewsets, status, generics
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_jwt.settings import api_settings

from . import models, serializers


# utils
def jwt_encode(user):
    payload = api_settings.JWT_PAYLOAD_HANDLER(user)
    return api_settings.JWT_ENCODE_HANDLER(payload)


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
        self.token = jwt_encode(self.user)

        data = {"user": self.user, "token": self.token}
        response = Response(data, status=status.HTTP_200_OK)

        return response
