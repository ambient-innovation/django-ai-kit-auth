from ai_kit_auth.serializers import LoginSerializer
from rest_framework import serializers
from . import models


class EmailUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.EmailUser
        fields = ["id", "email"]
