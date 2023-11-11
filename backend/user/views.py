from django.conf import settings
from django.http import HttpResponse, JsonResponse
from rest_framework.views import APIView
from rest_framework.exceptions import AuthenticationFailed
from user.serializers import TeacherSerializer
from rest_framework_simplejwt import tokens
from rest_framework import status, response
from django.core.cache import cache
from user.models import Teacher
from rest_framework.permissions import IsAuthenticated

class RegisterView(APIView):
    def post(self,request):
        password = request.data["password"]
        try:
            password1 = request.data["repeat_password"]
        except:
            return JsonResponse({"Error" : "Registration error"},safe=False,status=status.HTTP_400_BAD_REQUEST)
        if password != password1:
            return JsonResponse({"Error" : "Passwords don't match"},safe=False,status=status.HTTP_400_BAD_REQUEST)
        serializer = TeacherSerializer(data=request.data)
        
        if serializer.is_valid():
            teacher = serializer.save()
            teacher.set_password(request.data['password'])
            teacher.save()
        else:
            return JsonResponse(serializer.errors,safe=False,status=status.HTTP_400_BAD_REQUEST)
        return JsonResponse(serializer.data,safe=False,status=status.HTTP_201_CREATED)
    
def get_user_tokens(user):
    refresh = tokens.RefreshToken.for_user(user)
    return {
        "refresh_token": str(refresh),
        "access_token": str(refresh.access_token)
    }

class LoginView(APIView):
    def post(self,request):
        email = request.data["email"]
        password = request.data["password"]

        user = Teacher.objects.filter(email=email).first()

        #auth_failure_key = 'LOGIN_FAILURES_AT_%s' % request.META.get('REMOTE_ADDR')
        #auth_failures = cache.get(auth_failure_key) or 0
        #if auth_failures > 3:
        #    raise AuthenticationFailed("Locked out; too many authentication failures")

        if user is None:
        #    cache.set(auth_failure_key,auth_failures+1,3600)
            raise AuthenticationFailed("User not found.")
    
        if not user.check_password(password):
        #    cache.set(auth_failure_key,auth_failures+1,3600)
            raise AuthenticationFailed("Incorrect password.")
        
        tokens = get_user_tokens(user)
        res = HttpResponse("")
        res.set_cookie(
            key=settings.SIMPLE_JWT['AUTH_COOKIE'],
            value=tokens["access_token"],
            expires=settings.SIMPLE_JWT['ACCESS_TOKEN_LIFETIME'],
            secure=settings.SIMPLE_JWT['AUTH_COOKIE_SECURE'],
            httponly=settings.SIMPLE_JWT['AUTH_COOKIE_HTTP_ONLY'],
            samesite=settings.SIMPLE_JWT['AUTH_COOKIE_SAMESITE']
        )
        res.set_cookie(
            key=settings.SIMPLE_JWT['AUTH_COOKIE_REFRESH'],
            value=tokens["refresh_token"],
            expires=settings.SIMPLE_JWT['REFRESH_TOKEN_LIFETIME'],
            secure=settings.SIMPLE_JWT['AUTH_COOKIE_SECURE'],
            httponly=settings.SIMPLE_JWT['AUTH_COOKIE_HTTP_ONLY'],
            samesite=settings.SIMPLE_JWT['AUTH_COOKIE_SAMESITE']
        )
        return res