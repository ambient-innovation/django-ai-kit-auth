from rest_framework.serializers import CharField
from ai_kit_auth.serializers import UserModel, UserSerializer


class CustomUserSerializer(UserSerializer):
    class Meta:
        model = UserModel
        fields = ["id", "email", "username", "is_active"]

    def get_test_string(self):
        return "test"
