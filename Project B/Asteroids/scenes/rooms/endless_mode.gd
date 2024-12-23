class_name EndlessRoom extends Room

func _ready() -> void:
	super._ready()
	GameManager.coins = 0
	Upgrades.reset_all()

func _process(delta: float) -> void:
	super._process(delta)
