from django.conf import settings
from django.http import HttpResponse, JsonResponse
from rest_framework import response
from rest_framework import status
from rest_framework.exceptions import AuthenticationFailed
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenRefreshView

from user.models import Teacher
from user.serializers import CookieTokenRefreshSerializer, TeacherSerializer


class RegisterView(APIView):
    def post(self, request):
        password = request.data["password"]
        try:
            password1 = request.data["repeat_password"]
        except:
            return JsonResponse({"Error": "Registration error"}, safe=False, status=status.HTTP_400_BAD_REQUEST)
        if password != password1:
            return JsonResponse({"Error": "Passwords don't match"}, safe=False, status=status.HTTP_400_BAD_REQUEST)
        serializer = TeacherSerializer(data=request.data)

        if serializer.is_valid():
            teacher = serializer.save()
            teacher.set_password(request.data['password'])
            teacher.save()
        else:
            return JsonResponse(serializer.errors, safe=False, status=status.HTTP_400_BAD_REQUEST)
        return JsonResponse(serializer.data, safe=False, status=status.HTTP_201_CREATED)


def get_user_tokens(user):
    refresh = RefreshToken.for_user(user)
    return {
        "refresh_token": str(refresh),
        "access_token": str(refresh.access_token)
    }


class LoginView(APIView):
    def post(self, request):
        email = request.data["email"]
        password = request.data["password"]

        user = Teacher.objects.filter(email=email).first()

        # auth_failure_key = 'LOGIN_FAILURES_AT_%s' % request.META.get('REMOTE_ADDR')
        # auth_failures = cache.get(auth_failure_key) or 0
        # if auth_failures > 3:
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


class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        return _do_logout(request)


def _do_logout(request):
    refreshToken = request.COOKIES.get(
        settings.SIMPLE_JWT['AUTH_COOKIE_REFRESH'])
    token = RefreshToken(refreshToken)
    token.blacklist()

    res = response.Response()
    res.delete_cookie(settings.SIMPLE_JWT['AUTH_COOKIE'])
    res.delete_cookie(settings.SIMPLE_JWT['AUTH_COOKIE_REFRESH'])
    return res


class CookieTokenRefreshView(TokenRefreshView):
    serializer_class = CookieTokenRefreshSerializer

    def post(self, request, *args, **kwargs):
        refresh_token = request.COOKIES.get(settings.SIMPLE_JWT['AUTH_COOKIE_REFRESH'])
        if refresh_token:
            serializer = self.get_serializer(data={'refresh': refresh_token})

            if serializer.is_valid():
                access_token = serializer.validated_data['access']

                response = JsonResponse({'success': 'success'})
                response.set_cookie(
                    key=settings.SIMPLE_JWT['AUTH_COOKIE'],
                    value=str(access_token),
                    expires=settings.SIMPLE_JWT['ACCESS_TOKEN_LIFETIME'],
                    secure=settings.SIMPLE_JWT['AUTH_COOKIE_SECURE'],
                    httponly=settings.SIMPLE_JWT['AUTH_COOKIE_HTTP_ONLY'],
                    samesite=settings.SIMPLE_JWT['AUTH_COOKIE_SAMESITE']
                )
                return response

        return JsonResponse({'detail': 'No valid refresh token found in cookie'}, safe=False,
                            status=status.HTTP_400_BAD_REQUEST)


class TeacherView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        teacher = Teacher.objects.get(email=request.user)
        serializer = TeacherSerializer(teacher)
        filtered_data = {key: serializer.data[key] for key in ['email', 'first_name', 'last_name']}
        return response.Response(filtered_data)

    def patch(self, request):
        user = Teacher.objects.get(email=request.user)
        email = request.data["email"]
        password = request.data["password"]
        password1 = request.data["repeat_password"]
        first_name = request.data["first_name"]
        last_name = request.data["last_name"]
        if password != password1:
            return JsonResponse({"Error": "Passwords don't match"}, safe=False, status=status.HTTP_400_BAD_REQUEST)
        serializer = TeacherSerializer(user, data={"first_name": first_name, "last_name": last_name, "email": email,
                                                   "password": password}, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        teacher = Teacher.objects.get(email=email)
        serializer = TeacherSerializer(teacher)
        filtered_data = {key: serializer.data[key] for key in ['email', 'first_name', 'last_name']}
        return JsonResponse(filtered_data, safe=False)

    def delete(self,request):
        #user = Teacher.objects.get(email=request.user)
        #user.delete()
        user = Teacher.objects.get(email=request.user)
        serializer = TeacherSerializer(user, data={"is_active":False,},partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return _do_logout(request)
