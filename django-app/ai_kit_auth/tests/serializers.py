from rest_framework.serializers import CharField
from ai_kit_auth.serializers import UserModel, UserSerializer, RegistrationSerializer


class CustomUserSerializer(UserSerializer):
    class Meta:
        model = UserModel
        fields = ["id", "email", "username", "is_active"]

    def get_test_string(self):
        return "test"

class CustomRegistrationSerializer(RegistrationSerializer):
    last_name  = CharField(required = True, error_messages={"required": "required", "blank": "blank"})