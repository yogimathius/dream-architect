export interface Dream {
	id: string;
	title: string;
	description: string;
	choices: Choice[];
	locked: boolean;
	position?: { x: number; y: number }; // For storing position in the map
}

export interface Choice {
	text: string;
	unlocks: string[]; // IDs of dreams this choice unlocks
}

export const dreams: Dream[] = [
	{
		id: '1',
		title: 'The Endless Forest',
		description:
			'You find yourself in a vast forest where trees stretch impossibly high. The air is thick with mist, and whispers seem to follow you wherever you go.',
		locked: false, // Starting dream, unlocked by default
		choices: [
			{
				text: 'Follow the sound of running water',
				unlocks: ['2']
			},
			{
				text: 'Climb the tallest tree you can find',
				unlocks: ['3']
			},
			{
				text: 'Look for a path through the underbrush',
				unlocks: ['4']
			}
		]
	},
	{
		id: '2',
		title: 'Crystal Caverns',
		description:
			'Luminescent crystals illuminate a massive underground cavern. Your footsteps echo as you walk, and each crystal seems to respond to your presence with subtle changes in color.',
		locked: true, // Initially locked
		choices: [
			{
				text: 'Touch the nearest crystal',
				unlocks: ['5']
			},
			{
				text: 'Search for a deeper passage',
				unlocks: []
			},
			{
				text: 'Collect a small crystal shard',
				unlocks: []
			}
		]
	},
	{
		id: '3',
		title: 'The Floating Islands',
		description:
			'You stand on a small island of earth and grass, floating in an endless sky. Other islands drift nearby, some close enough to jump to, others far in the distance.',
		locked: true, // Initially locked
		choices: [
			{
				text: 'Jump to the nearest island',
				unlocks: ['4']
			},
			{
				text: 'Look for something to use as a bridge',
				unlocks: ['5']
			},
			{
				text: 'Call out to see if anyone else is here',
				unlocks: []
			}
		]
	},
	{
		id: '4',
		title: 'Clock Tower Labyrinth',
		description:
			'Inside an impossibly complex clock tower, gears of all sizes turn around you. The constant ticking creates a rhythm that seems to pull at the edges of your consciousness.',
		locked: true, // Initially locked
		choices: [
			{
				text: 'Follow the largest gear',
				unlocks: []
			},
			{
				text: 'Climb the central mechanism',
				unlocks: ['5']
			},
			{
				text: 'Look for the source of the ticking',
				unlocks: []
			}
		]
	},
	{
		id: '5',
		title: 'Ocean of Stars',
		description:
			"The surface beneath you is like glass, reflecting a universe of stars both above and below. It feels as though you're walking through space itself.",
		locked: true, // Initially locked
		choices: [
			{
				text: 'Kneel down and touch the surface',
				unlocks: []
			},
			{
				text: 'Look for constellations you recognize',
				unlocks: []
			},
			{
				text: 'Walk toward the brightest star',
				unlocks: []
			}
		]
	}
];
