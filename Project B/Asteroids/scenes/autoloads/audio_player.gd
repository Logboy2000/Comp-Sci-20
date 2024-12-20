extends Node

func play_sound(stream: AudioStream):
	# Create a new AudioStreamPlayer for each sound
	var stream_player = AudioStreamPlayer.new()
	add_child(stream_player)
	
	# Set the stream and play the sound
	stream_player.stream = stream
	stream_player.play()

	# Connect a signal to clean up the player once the sound finishes
	stream_player.connect("finished", Callable(self, "_on_sound_finished").bind(stream_player))

func _on_sound_finished(stream_player):
	stream_player.queue_free()
