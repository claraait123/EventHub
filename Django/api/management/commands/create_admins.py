from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
import os

class Command(BaseCommand):

    def handle(self, *args, **kwargs):
        admins = [
            {
                'username': os.environ.get('ADMIN1_USERNAME', 'admin1'),
                'password': os.environ.get('ADMIN1_PASSWORD', ''),
            },
            {
                'username': os.environ.get('ADMIN2_USERNAME', 'admin2'),
                'password': os.environ.get('ADMIN2_PASSWORD', ''),
            },
            {
                'username': os.environ.get('ADMIN3_USERNAME', 'admin3'),
                'password': os.environ.get('ADMIN3_PASSWORD', ''),
            },
        ]

        for admin in admins:
            if not admin['password']:
                continue
            if User.objects.filter(username=admin['username']).exists():
                self.stdout.write(f"{admin['username']} already exists, skipping.")
            else:
                User.objects.create_superuser(
                    username=admin['username'],
                    password=admin['password']
                )
                self.stdout.write(f"Admin '{admin['username']}' created.")