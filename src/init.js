function initialize() {
    setTimeout(() => {
        const c = 'font-size: large;';
        const c1 = c + 'background-color: #282c34; color: white;';
        const c2 = c + 'background-color: black; color: #DDD;';
        let cls = [];
        for (let i = 0; i < 12; i++) {
            cls = cls.concat([c2, c1]);
        }
        console.log(
            String.raw`%c
                    %c                                     %c
  /==============   %c                                     %c
  ||/============   %c                                     %c
  |||     |||       %c         Editor++                    %c
  |||     |||       %c                                     %c
  ||\===========    %c        Made by ReversedGravity.     %c
  ||/===========    %c                                     %c
  |||     |||       %c        Email: rg@youxplode.com      %c
  |||     |||       %c        Discord: iMplode-nZ#5773     %c
  ||\============   %c                                     %c
  \==============   %c                                     %c
                    %c                                     %c
`,
            c1,
            ...cls
        );
    }, 3000);
}

export default (epp) =>
    epp.plugin({
        id: 'init',
        name: 'init',
        description: 'Another part of the core, do not deactivate.',
        dependencies: ['core'],
        init: initialize,
    });
