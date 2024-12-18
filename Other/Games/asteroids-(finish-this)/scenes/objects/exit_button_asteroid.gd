extends Asteroid

func _ready() -> void:
	super._ready()

func hit(damage: int = 1):
	super.hit(damage)

func destroy():
	super.destroy()
	GameManager.quit_game()
