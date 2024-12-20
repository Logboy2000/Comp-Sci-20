extends Upgrade

var initial_top_speed: int = 0

func _ready() -> void:
	super._ready()
	initial_top_speed = GameManager.player.top_speed

func level_up(amount: int = 1):
	super.level_up(amount)
	GameManager.player.top_speed = (20 * level) + initial_top_speed
