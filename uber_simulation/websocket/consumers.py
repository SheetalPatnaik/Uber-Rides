from channels.generic.websocket import AsyncWebsocketConsumer
import json
from rest_framework_simplejwt.tokens import AccessToken, RefreshToken
from django.contrib.auth.models import User
from users.models import Customer, getRandomId
from driver.models import Driver

def getDriverByToken(token):
    try:
        access_token = AccessToken(token=token, verify=True)
        print(access_token["user_id"])
        driver = Driver.objects.filter(id=access_token["user_id"]).first()
        return driver
    except Exception as e:
        print(e)
    return None

def getCustomerByToken(token):
    try:
        access_token = AccessToken(token=token, verify=True)
        print("customer_id======>", access_token["customer_id"])
        customer = Customer.objects.filter(customer_id=access_token["customer_id"]).first()
        return customer
    except Exception as e:
        print(e)
    return None

class BasicConsumerWebSocket(AsyncWebsocketConsumer):
    async def disconnect(self, close_code):
        try:
            # Leave room group
            if self.room_group_name and self.channel_name:
                await self.channel_layer.group_discard(
                    self.room_group_name, self.channel_name
                )
        except Exception as e:
            print(e)


    async def receive(self, text_data):
        # Handle messages received from WebSocket client (if needed)
        pass


class DriverConsumerWebSocket(BasicConsumerWebSocket):
    async def connect(self):
        token = self.scope['url_route']['kwargs']["token"]
        driver = getDriverByToken(token)
        if driver:
            # print(user.id)
            self.room_group_name = str(driver.id)

            # Join room group
            await self.channel_layer.group_add(
                self.room_group_name,
                self.channel_name
            )

            await self.accept()
        else:
            await self.close()


    
    async def create_ride(self, event):
        # Send the Kafka message to the WebSocket client
        message = event['message']
        await self.send(text_data=json.dumps({'message': message}))

    async def ride_accepted(self, event):
        # Send the Kafka message to the WebSocket client
        message = event['message']
        await self.send(text_data=json.dumps({'message': message}))

class CustomerConsumerWebSocket(BasicConsumerWebSocket):
    async def connect(self):
        token = self.scope['url_route']['kwargs']["token"]
        customer = getCustomerByToken(token)
        print(customer, token)
        if customer:
            # print(user.id)
            chat_id= ""
            if customer.chat_id:
                chat_id = customer.chat_id
            else:
                chat_id = getRandomId()
                customer.chat_id = chat_id
                customer.save()
            self.room_group_name = chat_id

            # Join room group
            await self.channel_layer.group_add(
                self.room_group_name,
                self.channel_name
            )

            await self.accept()
        else:
            await self.close()


    async def ride_accepted(self, event):
        # Send the Kafka message to the WebSocket client
        message = event['message']
        await self.send(text_data=json.dumps({'message': message}))
