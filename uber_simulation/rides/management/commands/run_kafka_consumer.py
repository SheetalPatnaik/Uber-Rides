from django.core.management.base import BaseCommand
from confluent_kafka import Consumer, KafkaError
import json
from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer
from django.conf import settings
from rides.constants import *
from driver.models import Driver
from users.models import Customer, getRandomId, Booking

class Command(BaseCommand):
    help = 'Run Kafka consumer to listen for messages'

    def handle(self, *args, **options):
        # Kafka consumer configuration
        consumer_config = {
            'bootstrap.servers': settings.KAFKA_BOKER,  # Kafka broker address
            'group.id': 'order-group',               # Consumer group ID
            'auto.offset.reset': 'earliest',         # Start from the earliest message
        }

        # Initialize Kafka consumer
        consumer = Consumer(consumer_config)
        consumer.subscribe([settings.KAFKA_TOPIC])  # Subscribe to the 'orders' topic
        channel_layer = get_channel_layer()
        print('Starting Kafka consumer...')

        try:
            while True:
                msg = consumer.poll(1.0)  # Poll for new messages

                if msg is None:
                    continue
                if msg.error():
                    if msg.error().code() == KafkaError._PARTITION_EOF:
                        print(f"End of partition reached {msg.topic()} [{msg.partition()}] at offset {msg.offset()}")
                    elif msg.error():
                        print(f"Error: {msg.error()}")
                        break
                else:
                    # Process the received message
                    data = json.loads(msg.value().decode('utf-8'))
                    print(f"Received message: {data}")
                    if data.get("type")==CREATE_RIDE:
                        if data.get("data"):
                            driver_ids = list(Driver.objects.all().values_list("id", flat=True))
                            for driver_id in driver_ids:
                                async_to_sync(channel_layer.group_send)(
                                    str(driver_id),  # The group name for WebSocket clients
                                    {
                                        'type': 'create_ride',
                                        'message': data,
                                    }
                                ) 
                    elif data.get("type")==RIDE_ACCEPTED:
                        if data.get("data"):
                            ride_id = data.get("data").get("ride_id")
                            ride = Booking.objects.filter(booking_id=ride_id).first()
                            if ride and ride.customer:
                                chat_id = ""
                                if ride.customer.chat_id:
                                    chat_id = ride.customer.chat_id
                                else:
                                    chat_id = getRandomId()
                                    ride.customer.chat_id = chat_id
                                    ride.customer.save()
                                async_to_sync(channel_layer.group_send)(
                                    chat_id,  # The group name for WebSocket clients
                                    {
                                        'type': 'ride_accepted',
                                        'message': data,
                                    }
                                ) 
                            driver_ids = list(Driver.objects.all().values_list("id", flat=True))
                            for driver_id in driver_ids:
                                async_to_sync(channel_layer.group_send)(
                                    str(driver_id),  # The group name for WebSocket clients
                                    {
                                        'type': 'ride_accepted',
                                        'message': data,
                                    }
                                ) 
                    elif data.get("type") in [RIDE_COMPLETED, PICKED_RIDER]:
                        if data.get("data"):
                            ride_id = data.get("data").get("ride_id")
                            ride = Booking.objects.filter(booking_id=ride_id).first()
                            if ride and ride.customer:
                                chat_id = ""
                                if ride.customer.chat_id:
                                    chat_id = ride.customer.chat_id
                                else:
                                    chat_id = getRandomId()
                                    ride.customer.chat_id = chat_id
                                    ride.customer.save()
                                async_to_sync(channel_layer.group_send)(
                                    chat_id,  # The group name for WebSocket clients
                                    {
                                        'type': 'ride_accepted',
                                        'message': data,
                                    }
                                ) 
                                
                     # Send the message to WebSocket clients
                    # group_ids = data.get("group_ids",[])
                    # data = data.get("data",{})
                    

        except KeyboardInterrupt:
            pass
        finally:
            # Cleanup
            consumer.close()
