extends Node

var music_player: AudioStreamPlayer = null
var is_fading_out: bool = false
var fade_duration: float = 1.0
var fade_timer: float = 0.0
var start_volume: float = 0.0

func _ready():
	# Initialize the music player as a child node
	music_player = AudioStreamPlayer.new()
	music_player.process_mode = Node.PROCESS_MODE_ALWAYS
	add_child(music_player)

func play_sound(stream: AudioStream):
	# Create a new AudioStreamPlayer for each sound
	var stream_player = AudioStreamPlayer.new()
	stream_player.process_mode = Node.PROCESS_MODE_ALWAYS
	add_child(stream_player)
	
	# Set the stream and play the sound
	stream_player.stream = stream
	stream_player.play()

	# Connect a signal to clean up the player once the sound finishes
	stream_player.connect("finished", Callable(self, "_on_sound_finished").bind(stream_player))

func play_music(stream: AudioStream):
	# Stop any currently playing music
	if music_player.playing:
		music_player.stop()

	# Set the new music stream and play it
	music_player.stream = stream
	music_player.volume_db = 0  # Start at normal volume
	music_player.play()

func is_playing_music():
	return music_player.playing

func fade_out_music(duration: float = 1.0):
	# Start fading out the music
	if music_player.playing:
		is_fading_out = true
		fade_duration = duration
		fade_timer = 0.0
		start_volume = music_player.volume_db

func _process(delta: float):
	# Handle fading out the music
	if is_fading_out:
		fade_timer += delta
		# Calculate the new volume using lerp
		music_player.volume_db = lerp(start_volume, -80, fade_timer / fade_duration)

		# Stop fading if the duration is complete
		if fade_timer >= fade_duration:
			is_fading_out = false
			music_player.stop()

func stop_music():
	# Stop the music immediately
	if music_player.playing:
		music_player.stop()

func _on_sound_finished(stream_player):
	# Free the stream player after it finishes
	stream_player.queue_free()
