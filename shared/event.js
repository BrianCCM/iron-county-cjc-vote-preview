/* Single source of truth for both voter pages, the big screen and the admin panel.
   Facts below come from the event poster (Instagram, Oct 2026). Vote counts are
   sample data for the prototype. */
window.CJC = (function () {

  const EVENT = {
    presenter : "Friends of the Iron County Children's Justice Center",
    name      : 'Dancing with the Community Stars',
    theme     : 'Battle of the Bands',
    beneficiary: "Iron County Children's Justice Center",
    tagline   : 'Where small voices are heard',
    dateLong  : 'Monday, November 17',
    showTime  : '7:00 PM',
    lobby     : '6:00 PM',
    house     : '6:30 PM',
    venue     : 'Heritage Center Theatre',
    address   : '105 N 100 E, Cedar City',
    ticket    : 15,
    contact   : { name: 'Jennifer Davis', role: 'Iron County CJC Friends Board', phone: '435-590-1317' },
    goal      : 120000
  };

  // Eight community stars, from the poster. Vote counts are sample data.
  const DANCERS = [
    { id:1, slug:'riley-taylor',      name:'Riley Taylor',      votes:4120 },
    { id:2, slug:'latosha-anderson',  name:'Latosha Anderson',  votes:3870 },
    { id:3, slug:'mirryn-morrill',    name:'Mirryn Morrill',    votes:3655 },
    { id:4, slug:'nicole-funderburk', name:'Nicole Funderburk', votes:3290 },
    { id:5, slug:'rochell-topham',    name:'Rochell Topham',    votes:2980 },
    { id:6, slug:'dave-mcintyre',     name:'Dave McIntyre',     votes:2645 },
    { id:7, slug:'brady-williams',    name:'Brady Williams',    votes:2310 },
    { id:8, slug:'declan-mcginty',    name:'Declan McGinty',    votes:1905 }
  ];

  const JUDGES = [
    { slug:'derek-brown',   name:'Derek Brown'   },
    { slug:'paul-terry',    name:'Paul Terry'    },
    { slug:'rochelle-lunt', name:'Rochelle Lunt' }
  ];

  // $1 = 1 vote. Single dollar charges are deliberately not sold: Square's
  // fixed 30c would take a third of them. Bundles carry bonus votes instead.
  const BUNDLES = [
    { amt:5,   votes:5,   bonus:'' },
    { amt:20,  votes:25,  bonus:'5 bonus votes' },
    { amt:50,  votes:75,  bonus:'25 bonus votes', best:true },
    { amt:100, votes:175, bonus:'75 bonus votes' }
  ];

  // Square online, Plus plan. Cards and digital wallets only.
  // Cash, cheques and anything taken at a table carry no fee at all.
  const FEE = { pct: 0.029, fixed: 0.30, label: 'Card processing fee' };
  const feeFor = amt => Math.round((amt * FEE.pct + FEE.fixed) * 100) / 100;

  const photo = d => '../images/people/' + d.slug + '.webp';
  const money = n => '$' + n.toLocaleString('en-US', { minimumFractionDigits:2, maximumFractionDigits:2 });
  const plain = n => '$' + Math.round(n).toLocaleString('en-US');

  return { EVENT, DANCERS, JUDGES, BUNDLES, FEE, feeFor, photo, money, plain };
})();
