from confluent_kafka import Producer
import json
from django.conf import settings
from django.conf import settings

# Kafka configuration settings

KAFKA_CONFIG = {
    'bootstrap.servers': settings.KAFKA_BOKER,  # Kafka broker address
}
# Initialize the Kafka producer
producer = Producer(KAFKA_CONFIG)

def delivery_report(err, msg):
    """Callback function to report message delivery status."""
    if err is not None:
        print(f'Message delivery failed: {err}')
    else:
        print(f'Message delivered to {msg.topic()} [{msg.partition()}]')

def send_kafka_message(data):
    """
    Function to send a message to Kafka topic.
    :param topic: Kafka topic to publish to
    :param data: Dictionary data to send
    """
    try:

        json_data = json.dumps(data)
        # Send message to Kafka topic
        producer.produce(settings.KAFKA_TOPIC, json_data, callback=delivery_report)
        producer.flush()  # Wait for all messages to be sent
        print(f"Message sent to topic '{settings.KAFKA_TOPIC}': {json_data}")
    except Exception as e:
        print(f"Error sending message to Kafka: {str(e)}")