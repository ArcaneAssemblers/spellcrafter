import { SpellcrafterPlugin } from './plugins/spellcrafter_plugin';

const RenJSConfig =  {
  'name': 'Quickstart',
  'w': 640,
  'h': 960,
  'renderer': Phaser.AUTO, // become renderer
  'scaleMode': Phaser.ScaleManager.SHOW_ALL,
  'loadingScreen': {
    'background': '/assets/gui/loaderloaderbackground.png',
    'loadingBar': {
      'asset': '/assets/gui/loaderloading-bar.png',
      'position': {
        'x': 109,
        'y': 458
      },
      'size': {
        'w': 578,
        'h': 82
      }
    }
  },
  'fonts': '/assets/gui/fonts.css',
  'guiConfig': '/story/GUI.yaml',
  storyConfig: '/story/Config.yaml',
  storySetup: '/story/Setup.yaml',
  'storyText': [
    '/story/Story.yaml'
  ],
  'logChoices': false,
}

window.RenJSGame = new window.RenJS.game(RenJSConfig)
window.RenJSGame.addPlugin('SpellCrafter', SpellcrafterPlugin)
window.RenJSGame.launch()
