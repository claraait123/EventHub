# EventHub
Event and Participant Management System


## Installation et Démarrage

Windows
```
# Création du dossier Django et de l'environnement virtuel
mkdir Django
cd Django
python -m venv venv

# Activation de l'environnement (sur Windows)
.\venv\Scripts\activate

# Installation de Django, Django REST Framework et CORS headers
pip install django djangorestframework django-cors-headers

# Création du projet initial
django-admin startproject eventhub_project .
```

### Modifier Django/eventhub_project/settings.py

Code initial :
```
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles'
]
```

Modification : 
```
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    
    'rest_framework',
    'corsheaders',
    'django_filters',
    'api',
]
```

### Modifier Django/eventhub_project/urls.py
```
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('api.urls')),
]
```

### Suite de l'installation : 

```
# Appliquer les migrations
python manage.py makemigrations api
python manage.py migrate

# Créer un compte administrateur
python manage.py createsuperuser

# Lancer le serveur
python manage.py runserver
```

L'API sera accessible sur : http://127.0.0.1:8000/api/


## Endpoints de l'API REST

Toutes les routes principales sont disponibles sous le préfixe /api/ :

### Événements
GET /api/events/ : Lister les événements (paramètres acceptés : ?date=YYYY-MM-DD & ?status=planned)

POST /api/events/ : Créer un événement (Admin requis)

GET /api/events/{id}/ : Détails d'un événement

PUT /api/events/{id}/ : Modifier un événement (Admin requis)

DELETE /api/events/{id}/ : Supprimer un événement (Admin requis)

### Participants
GET /api/participants/ : Lister les participants

POST /api/participants/ : Ajouter un participant (Admin requis)

GET /api/participants/{id}/ : Détails d'un participant

### Inscriptions
GET /api/registrations/ : Lister les inscriptions

POST /api/registrations/ : Inscrire un participant à un événement (Admin requis)


## Interface administration

L'interface d'administration Django est configurée pour une gestion facile des données sans passer par Postman.
Accessible sur : http://127.0.0.1:8000/admin/


## Fonctionnalités implémentées

Conformément aux exigences du cahier des charges, cette API REST gère les fonctionnalités suivantes :

- **Gestion des événements** : Création, lecture, mise à jour, suppression (CRUD) et filtrage par date ou par statut (prévu, en cours, terminé, annulé).

- **Gestion des participants** : CRUD pour les profils des participants.

- **Inscriptions** : Association *Many-to-Many* entre événements et participants. Une règle métier stricte empêche un participant de s'inscrire deux fois au même événement.

- **Sécurité et Rôles** : 
  - *Admin/Éditeur* : Accès complet en lecture et écriture.
  - *Visiteur (Viewer)* : Accès en lecture seule.


## Technologies utilisées

- Python 3.x
- Django
- Django REST Framework (DRF)
- django-filter (pour le filtrage des requêtes GET)