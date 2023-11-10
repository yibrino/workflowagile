from rest_framework import serializers
from .models import Teacher

class TeacherSerializer(serializers.ModelSerializer):

    class Meta:
        model = Teacher
        fields = ('id', 'first_name', 'last_name', 'email', 'password', 'is_staff', 'is_active', 'date_joined')
        read_only_fields = ('id', 'date_joined')

    def validate_password(self, value):
        if not any(char.isupper() for char in value):
            raise serializers.ValidationError("Password must contain at least one uppercase letter.")
        if not any(char.isdigit() for char in value):
            raise serializers.ValidationError("Password must contain at least one digit.")
        if not any(char in "!@#$%^&*()_+-=|;:,.?/" for char in value):
            raise serializers.ValidationError("Password must contain at least one special character.")
        return value

