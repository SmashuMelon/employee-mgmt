from rest_framework import serializers
from .models import Payment

class PaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = ['id', 'session', 'amount', 'payment_date']
        read_only_fields = ['amount', 'payment_date']
