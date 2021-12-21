from django.urls import path

from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('zones', views.about, name='about'),
    path('change_light_state', views.change_light_state, name='change_light_state'),
    path('get_lights_state', views.get_lights_state, name='get_lights_state')
]