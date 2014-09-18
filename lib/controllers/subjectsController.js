var mongoose = require('mongoose'),
    search = require('./search'),
    PaperStatus = mongoose.model('PaperStatus'),
    Comments = mongoose.model('Comments'),
    Article = mongoose.model('Article'),
    Subscription = mongoose.model('Subscription'),
    PassKey = mongoose.model('PassKey');

var moment = require('moment-timezone');

var mainMap = {};
mainMap['subjects']= ['Polity','Economy','WGeography','IGeography','History','Environment','Science'];

var subjectMap = {};
subjectMap['Polity'] = ['Salient Features of Constituion','Preamble','Union and Territories','Citizenship','Fundamental Rights',
    'DPSP and FD',
    'President and Vice President','Council of Ministers, CAG and AG','Parliament','Judiciary','State Government','Panchayats',
    'Fifth Schedule and Sixth Schedule','Union and State Relations','Services and Tribunals','Elections',
    'Emergency','Constitution Amendments','Polity Miscellaneous','Public Policy','Social Issues and Rights'];

subjectMap['Economy'] = ['Basics','Planning','Public Finance','Money Markets','RBI','Monetary Policy and Fiscal Policy',
    'Prices and Inflation','Balance of Payments','International Trade','Industry','Services','Agriculture','Energy, ' +
        'Infrastrucuture and Communications','Sustainable Development and Climate Change','Human Development',
        'Economy Miscellaneous'];

exports.getTopics = function (req, res, next) {
    if (req.params.subject){
        res.json(200,subjectMap[req.params.subject]);
    }
};

exports.subjects = subjectMap;




