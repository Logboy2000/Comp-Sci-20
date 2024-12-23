extends Room
const SONG_1 = preload("res://assets/Audio/song1.ogg")
func _ready() -> void:
	if AudioPlayer.is_playing_music():
		AudioPlayer.play_music(SONG_1)
	super._ready()
