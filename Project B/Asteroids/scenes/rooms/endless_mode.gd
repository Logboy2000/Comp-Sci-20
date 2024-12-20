class_name EndlessRoom extends Room

@onready var coin_label: Label = $UI/Control/HBoxContainer/CoinLabel

func _ready() -> void:
	super._ready()

func _process(delta: float) -> void:
	super._process(delta)
	coin_label.text = str(GameManager.coins)
	
