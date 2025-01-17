class_name Upgrade extends Node

@export var label_text: String = "Name Me!"
@export var icon_texture: Texture2D = preload("res://icon.svg")
@export var starting_price = 15
@export var price_multiplier: float = 1.1
var price: int = 0
@onready var name_label: Label = $Button/MarginContainer/VBoxContainer/Name
@onready var price_label: Label = $Button/MarginContainer/VBoxContainer/HBoxContainer/Cost
@onready var button: Button = $Button

@onready var icon: TextureRect = $Button/MarginContainer/VBoxContainer/Icon

var level = 1

func _ready() -> void:
	price = starting_price
	name_label.text = label_text
	price_label.text = str(price)
	icon.texture = icon_texture

func _process(_delta: float) -> void:
	if GameManager.coins < price:
		button.disabled = true
	else:
		button.disabled = false

func level_up(amount: int = 1):
	GameManager.coins -= price
	level += amount
	price = round(starting_price * pow(price_multiplier, level))
	price_label.text = str(price)

func _on_button_pressed() -> void:
	if GameManager.coins >= price:
		level_up(1)
