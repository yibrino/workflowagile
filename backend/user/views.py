from django.http import JsonResponse
from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework import status


from user.serializers import TeacherSerializer

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

