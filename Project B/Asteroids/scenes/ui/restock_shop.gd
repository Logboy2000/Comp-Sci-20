extends Control

@export var start_price: int = 10
@export var price_mult: float = 1.1
var price: int = 0
@onready var price_label: Label = $VBoxContainer/Control/PriceLabel
@onready var restock_button: Button = $VBoxContainer/RestockButton
const CLICK_SOUND = preload("res://assets/audio/click.ogg")
func _ready() -> void:
	price = start_price
	price_label.text = str(price)

func _process(_delta: float) -> void:
	if GameManager.coins < price:
		restock_button.disabled = true
		modulate = Color(1,1,1,0.5)
	else:
		restock_button.disabled = false
		modulate = Color(1,1,1,1)

func _on_button_pressed() -> void:
	GameManager.coins -= price
	price = round(price * price_mult)
	price_label.text = str(price)
	Audio.play_sound(CLICK_SOUND)
