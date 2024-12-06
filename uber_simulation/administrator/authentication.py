from django.contrib.auth.backends import ModelBackend
from .models import Administrator

class AdministratorBackend(ModelBackend):
    def authenticate(self, request, email=None, password=None, **kwargs):
        try:
            admin_user = Administrator.objects.get(email=email)
            if admin_user.check_password(password):
                return admin_user
        except Administrator.DoesNotExist:
            return None

    def get_user(self, user_id):
        try:
            return Administrator.objects.get(pk=user_id)
        except Administrator.DoesNotExist:
            return None
