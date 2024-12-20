extends Room

func _ready() -> void:
	TransitionLayer.play_transition(true)
	GameManager.current_zoom = 1
	super._ready()
	

func _process(delta: float) -> void:
	super._process(delta)
