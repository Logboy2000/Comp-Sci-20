extends Room

func _ready() -> void:
	TransitionLayer.play_transition(true)
	super._ready()

func _process(delta: float) -> void:
	super._process(delta)
