from django.apps import AppConfig


class BookingConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'booking'
    verbose_name = 'Booking Management'
    
    def ready(self):
        # Import signals here if needed in the future
        pass