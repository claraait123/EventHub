from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (EventViewSet, ParticipantViewSet, RegistrationViewSet, register_user, get_user_profile, get_current_user, join_event, leave_event, my_events, remove_member, user_settings, change_password, delete_account, delete_user, list_all_users, admin_edit_user)
from rest_framework.authtoken.views import obtain_auth_token

router = DefaultRouter()
router.register(r'events', EventViewSet)
router.register(r'participants', ParticipantViewSet)
router.register(r'registrations', RegistrationViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('register/', register_user, name='register'),
    path('login/', obtain_auth_token, name='login'),
    path('profiles/<str:username>/', get_user_profile, name='user_profile'),
    path('me/', get_current_user, name='current_user'),
    path('events/<int:event_id>/join/', join_event, name='join_event'),
    path('events/<int:event_id>/leave/', leave_event, name='leave_event'),
    path('my-events/', my_events, name='my_events'),
    path('events/<int:event_id>/remove/<int:user_id>/', remove_member, name='remove_member'),
    path('settings/', user_settings, name='user_settings'),
    path('settings/change-password/', change_password, name='change_password'),
    path('settings/delete-account/', delete_account, name='delete_account'),
    path('profiles/<str:username>/delete/', delete_user, name='delete_user'),
    path('admin/users/', list_all_users, name='list_all_users'),
    path('admin/users/<str:username>/edit/', admin_edit_user, name='admin_edit_user'),
]