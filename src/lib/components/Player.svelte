<script lang="ts">
	import 'plyr/dist/plyr.css';
	import Plyr from 'plyr';
	import Hls from 'hls.js';
	import { onMount } from 'svelte';

	export let playUrl: string;

	onMount(() => {
		// const player = new Plyr('#player');
		const videoElement = document.getElementById('player')! as HTMLMediaElement;

		// Initialize Plyr for the video element
		new Plyr(videoElement, {
			autoplay: true,
			muted: true, // Required to autoplay in modern browsers
			controls: [
				'play-large',
				'duration',
				'current-time',
				'rewind',
				'fast-forward',
				'progress',
				'mute',
				'volume',
				'fullscreen',
				'settings',
			],
		});

		if (playUrl.endsWith('.m3u8') || playUrl.endsWith('.m3u')) {
				const hls = new Hls(
				{
					xhrSetup: (xhr, url) => {
						xhr.withCredentials = false;
						if (url.includes('http')) {
							xhr.open('GET', `/api/proxy?url=${url}`, true);
						} else {
							xhr.open('GET', url, true);
						}
					}
				}
			);

			hls.loadSource(playUrl);
			hls.attachMedia(document.getElementById('player')! as HTMLMediaElement);
			hls.on(Hls.Events.MANIFEST_PARSED, async function() {
				try {
					// player.play()
				} catch {
					// do nothing
				}
			});
		} else {
			videoElement.src = playUrl;
		}
	})

</script>

<video id="player" controls class="w-screen max-h-fit" src={playUrl}></video>
