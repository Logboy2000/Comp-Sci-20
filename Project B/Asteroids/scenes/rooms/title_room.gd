extends Room
const SONG_1 = preload("res://assets/audio/song1.ogg")
func _ready() -> void:
	super._ready()
	camera.zoom = 1.5
	await TransitionLayer.transition_finished
	Audio.play_music(SONG_1)
