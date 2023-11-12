from rest_framework import serializers
from .models import Teacher
from rest_framework_simplejwt.serializers import TokenRefreshSerializer
from rest_framework_simplejwt.exceptions import InvalidToken

class TeacherSerializer(serializers.ModelSerializer):

    class Meta:
        model = Teacher
        fields = ('id', 'first_name', 'last_name', 'email', 'password', 'is_staff', 'is_active', 'date_joined')
        read_only_fields = ('id', 'date_joined')

    def validate_password(self, value):
        if len(value) < 8:
            raise serializers.ValidationError("Password must contain at least 8 characters.")
        if len(value) > 16:
            raise serializers.ValidationError("Password must contain at most 16 characters.")
        if not any(char.isupper() for char in value):
            raise serializers.ValidationError("Password must contain at least one uppercase letter.")
        if not any(char.isdigit() for char in value):
            raise serializers.ValidationError("Password must contain at least one digit.")
        if not any(char in "!@#$%^&*()_+-=|;:,.?/" for char in value):
            raise serializers.ValidationError("Password must contain at least one special character.")
        return value

class CookieTokenRefreshSerializer(TokenRefreshSerializer):
    refresh = None

    def validate(self, attrs):
        attrs['refresh'] = self.context['request'].COOKIES.get('refresh')
        if attrs['refresh']:
            try:
                res = super().validate(attrs)
                return res
            except:
                raise InvalidToken("Refresh token expired")