extends Node

var music_player: AudioStreamPlayer = null
var sound_effects_pool: Array = []
var max_sfx: int = 20  # Limit the pool size to avoid excessive players
var sfx_bus: int = AudioServer.get_bus_index("SFX")
var sfx_count: int = 0

# Music fade-out properties
var is_fading_out: bool = false
var fade_duration: float = 1.0
var fade_timer: float = 0.0
var start_volume: float = 0.0

func _ready():
	# Initialize the music player
	music_player = AudioStreamPlayer.new()
	music_player.process_mode = Node.PROCESS_MODE_ALWAYS
	add_child(music_player)
	
	# Preload a bunch of reusable AudioStreamPlayers
	for i in range(max_sfx):
		var stream_player = AudioStreamPlayer.new()
		stream_player.bus = "SFX"
		add_child(stream_player)
		sound_effects_pool.append(stream_player)

func _process(delta: float):
	sfx_count = -1 # excludes music
	for i in get_children():
		if i.playing:
			sfx_count += 1
	DebugMenu.modify_label("sfx_count", "SFX#: " + str(sfx_count) + "/" + str(max_sfx))
	
	# Handle fading out the music
	if is_fading_out:
		fade_timer += delta
		music_player.volume_db = lerp(start_volume, -80.0, fade_timer / fade_duration)
		if fade_timer >= fade_duration:
			is_fading_out = false
			music_player.stop()

func play_sound(stream: AudioStream, pitch_min: float = 1, pitch_max: float = 1):
	if stream == null:
		return
	
	# Find an available player in the pool
	for player in sound_effects_pool:
		if not player.playing:
			# Configure the player
			player.stream = stream
			player.pitch_scale = randf_range(pitch_min, pitch_max)  # Add slight pitch variation
			player.volume_db = -3.0  # Slightly lower volume
			player.play()
			return

## Music stuff ##
func play_music(stream: AudioStream):
	if music_player.playing:
		music_player.stop()
	music_player.stream = stream
	music_player.volume_db = -6.0
	music_player.play()

func stop_music():
	if music_player.playing:
		music_player.stop()

func fade_out_music(duration: float = 1.0):
	if music_player.playing:
		is_fading_out = true
		fade_duration = duration
		fade_timer = 0.0
		start_volume = music_player.volume_db

func is_playing_music() -> bool:
	return music_player.playing
