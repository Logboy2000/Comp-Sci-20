extends Room
const SONG_1 = preload("res://assets/audio/song1.ogg")
func _ready() -> void:
	super._ready()
	await TransitionLayer.transition_finished
	AudioPlayer.play_music(SONG_1)
