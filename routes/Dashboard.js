const express   = require("express")
const sql       = require("mysql2")
const async     = require('async');
var storage     = require ('node-persist')
var redis       = require("redis")

var client = redis.createClient()
client.on('connect', function(){
    console.log('Dashboard connected ')
})

client.exists('tagNumber', function(err, reply){
    if(reply != 1){
       client.set('tagNumber', 1521)
    }else{
        client.incr('tagNumber')
        client.get('tagNumber', function(err, reply){
            console.log(reply)
        })
    }
})

const dashboard = express.Router()

//Create pool connection to DB
const pool = sql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'inves431_girlsEd',
    waitForConnections: true,
    connectionLimit: 20,
    queueLimit: 0
})

const poolTemp = sql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'inves431_girlsEd_temp',
    waitForConnections: true,
    connectionLimit: 20,
    queueLimit: 0
})

//GET from from DB
dashboard.get('/form/:tagNum', (req, res) =>{
  if(req.user){
    var tagNum = req.params.tagNum

    //initiative queries
    var query1 = 'SELECT * FROM initiative WHERE tagNumber =' + sql.escape(tagNum)
    var query2 = 'SELECT * FROM initiativeregion WHERE tagNumber =' + sql.escape(tagNum)
    var query3 = 'SELECT * FROM initiativecountryofoperation WHERE tagNumber =' + sql.escape(tagNum)
    var query4 = 'SELECT * FROM initiativeprogrammingactivities WHERE tagNumber =' + sql.escape(tagNum)
    var query5 = 'SELECT * FROM initiativefundingsource WHERE tagNumber =' + sql.escape(tagNum)
    var query6 = 'SELECT * FROM initiativelaunchcountry WHERE tagNumber =' + sql.escape(tagNum)
    var query7 = 'SELECT * FROM initiativetargetgeography WHERE tagNumber =' + sql.escape(tagNum)
    var query8 = 'SELECT * FROM initiativetargetpopulationsector WHERE tagNumber =' + sql.escape(tagNum)
    var query9 = 'SELECT * FROM initiativemonitoredoutcomes WHERE tagNumber =' + sql.escape(tagNum)
    var query10 = 'SELECT * FROM initiativeMainEducationSubsector WHERE tagNumber =' + sql.escape(tagNum)
    var query11 = 'SELECT * FROM initiativeEducationSubsectors WHERE initiativeTagNumber =' + sql.escape(tagNum)
    var query12 = 'SELECT * FROM initiativetargetschoolmanagement WHERE tagNumber =' + sql.escape(tagNum)

     //implementor queries
     var query13 = 'SELECT * FROM implements INNER JOIN implementor USING (implementorName) WHERE tagNum =' + sql.escape(tagNum)

    //funder queries
    var query14 = 'SELECT * FROM funds INNER JOIN funder USING (funderName) WHERE tagNum =' + sql.escape(tagNum)


    var formData = {}
    var fundersData = {}
    var funderIndividual = []

    async.parallel([
        function(queryDB) {
            pool.query(query1, {}, function(err, results) {
                if (err){
                    return queryDB(err)
                }else{
                    //If no results back for initiative, then form doesn't exist for corresponding tag number
                    if (results.length === 0) {
                      return queryDB("Could not find requested form")
                    }
                    formData.table1 = results;
                    queryDB()
                }

            })
        },
        function(queryDB) {
            pool.query(query2, {}, function(err, results) {
                if (err){
                    return queryDB(err)
                }else{
                    formData.table2 = results;
                    queryDB()
                }

            })
        },
        function(queryDB) {
            pool.query(query3, {}, function(err, results) {
                if (err){
                    return queryDB(err)
                }else{
                    formData.table3 = results;
                    queryDB()
                }

            })
        },
        function(queryDB) {
            pool.query(query4, {}, function(err, results) {
                if (err){
                    return queryDB(err)
                }else{
                    formData.table4 = results;
                    queryDB()
                }

            })
        },
        function(queryDB) {
            pool.query(query5, {}, function(err, results) {
                if (err){
                    return queryDB(err)
                }else{
                    formData.table5 = results;
                    queryDB()
                }

            })
        },
        function(queryDB) {
            pool.query(query6, {}, function(err, results) {
                if (err){
                    return queryDB(err)
                }else{
                    formData.table6 = results;
                    queryDB()
                }

            })
        },
        function(queryDB) {
            pool.query(query7, {}, function(err, results) {
                if (err){
                    return queryDB(err)
                }else{
                    formData.table7 = results;
                    queryDB()
                }

            })
        },
        function(queryDB) {
            pool.query(query8, {}, function(err, results) {
                if (err){
                    return queryDB(err)
                }else{
                    formData.table8 = results;
                    queryDB()
                }

            })
        },
        function(queryDB) {
            pool.query(query9, {}, function(err, results) {
                if (err){
                    return queryDB(err)
                }else{
                    formData.table9 = results;
                    queryDB()
                }

            })
        },
        function(queryDB) {
            pool.query(query10, {}, function(err, results) {
                if (err){
                    return queryDB(err)
                }else{
                    formData.table10 = results;
                    queryDB()
                }

            })
        },
        function(queryDB) {
            pool.query(query11, {}, function(err, results) {
                if (err){
                    return queryDB(err)
                }else{
                    formData.table11 = results;
                    queryDB()
                }

            })
        },
        function(queryDB) {
            pool.query(query12, {}, function(err, results) {
                if (err){
                    return queryDB(err)
                }else{
                    formData.table12 = results;
                    queryDB()
                }

            })
        },
        function(queryDB) {
            pool.query(query13, {}, function(err, results) {
                if (err){
                    return queryDB(err)
                }else{
                    formData.table13 = results;
                    queryDB()

                }

            })
        },
        function(queryDB) {
            pool.query(query14, {}, function(err, results) {
                if (err){
                    return queryDB(err)
                }else{
                    formData.table14 = results;
                    queryDB()

                }

            })
        }

     ], function(err) {
          if (err){
            res.json({"error": err})
          }else{
            funderQueries(formData.table14)

          }

     })


     function funderQueries(funderData){

        var final = 0
        //nest them here
        funderData.forEach(funder => {
          var query15 = 'SELECT * FROM funderasiabases WHERE funderName =' + sql.escape(funder.funderName)
          var query16 = 'SELECT * FROM funderasiaoperations WHERE funderName =' + sql.escape(funder.funderName)
          var query17 = 'SELECT * FROM fundereducationsubsectors WHERE funderName =' + sql.escape(funder.funderName)
          var query18 = 'SELECT * FROM funderinternationalbases WHERE funderName =' + sql.escape(funder.funderName)
          var query19 = 'SELECT * FROM funderorganizationtraits WHERE funderName =' + sql.escape(funder.funderName)


          async.parallel([
              function(queryDB) {
                  pool.query(query15, {}, function(err, results) {
                      if (err){
                          return queryDB(err, null);
                      }else{
                          queryDB(null, results);
                      }

                  })
              },
              function(queryDB) {
                  pool.query(query16, {}, function(err, results) {
                      if (err){
                          return queryDB(err, null);
                      }else{
                          queryDB(null, results);
                      }

                  })
              },
              function(queryDB) {
                  pool.query(query17, {}, function(err, results) {
                      if (err){
                          return queryDB(err, null);
                      }else{
                          queryDB(null, results);
                      }

                  })
              },
              function(queryDB) {
                  pool.query(query18, {}, function(err, results) {
                      if (err){
                          return queryDB(err, null);
                      }else{
                          queryDB(null, results);
                      }

                  })
              },
              function(queryDB) {
                  pool.query(query19, {}, function(err, results) {
                      if (err){
                          return queryDB(err, null);
                      }else{
                          queryDB(null, results);
                      }

                  })
              }

          ],

          function(err, results) {
              if (err){
                res.json(err);
              }else{
                  final++;
                  //push results here to avoid duplicated parallel writes to funderIndividual array
                  funderIndividual.push(results);
                  formData.funderIndividual = funderIndividual;

                  if(final == funderData.length)
                      res.json(formData);
              }
          })
        })
    }
  } else {
    res.json({"error": "Error: Not authorized to access this page"})
  }
})


//GET form from temp DB
dashboard.get('/form-temp/:tagNum', (req, res) =>{
  if(req.user){
    var tagNum = req.params.tagNum

    //initiative queries
    var query1 = 'SELECT * FROM initiative WHERE tagNumber = ' + sql.escape(tagNum)
    var query2 = 'SELECT * FROM initiativeregion WHERE tagNumber =' + sql.escape(tagNum)
    var query3 = 'SELECT * FROM initiativecountryofoperation WHERE tagNumber =' + sql.escape(tagNum)
    var query4 = 'SELECT * FROM initiativeprogrammingactivities WHERE tagNumber =' + sql.escape(tagNum)
    var query5 = 'SELECT * FROM initiativefundingsource WHERE tagNumber =' + sql.escape(tagNum)
    var query6 = 'SELECT * FROM initiativelaunchcountry WHERE tagNumber =' + sql.escape(tagNum)
    var query7 = 'SELECT * FROM initiativetargetgeography WHERE tagNumber =' + sql.escape(tagNum)
    var query8 = 'SELECT * FROM initiativetargetpopulationsector WHERE tagNumber =' + sql.escape(tagNum)
    var query9 = 'SELECT * FROM initiativemonitoredoutcomes WHERE tagNumber =' + sql.escape(tagNum)
    var query10 = 'SELECT * FROM initiativemaineducationsubsector WHERE tagNumber =' + sql.escape(tagNum)
    var query11 = 'SELECT * FROM initiativeeducationsubsectors WHERE initiativeTagNumber =' + sql.escape(tagNum)
    var query12 = 'SELECT * FROM initiativetargetschoolmanagement WHERE tagNumber =' + sql.escape(tagNum)

     //implementor queries
     var query13 = 'SELECT * FROM implements INNER JOIN implementor USING (implementorName) WHERE tagNum =' + sql.escape(tagNum)

    //funder queries
    var query14 = 'SELECT * FROM funds INNER JOIN funder USING (funderName) WHERE tagNum =' + sql.escape(tagNum)

    //status & comments queries
    var query15 = 'SELECT * FROM status INNER JOIN comments USING (tagNumber) WHERE tagNumber=' + sql.escape(tagNum)
    var query16 = 'SELECT * FROM sectionReviews WHERE tagNumber=' + sql.escape(tagNum)

    var formData = {}
    var fundersData = {}
    var funderIndividual = []



    async.parallel([
        function(queryDB) {
            poolTemp.query(query1, {}, function(err, results) {
                if (err){
                    return queryDB(err)
                }else{
                    //If no results back for initiative, then form doesn't exist for corresponding tag number
                    if (results.length === 0) {
                      return queryDB("Could not find requested form")
                    }
                    formData.table1 = results;
                    queryDB()
                }

            })
        },
        function(queryDB) {
            poolTemp.query(query2, {}, function(err, results) {
                if (err){
                    return queryDB(err)
                }else{
                    formData.table2 = results;
                    queryDB()
                }

            })
        },
        function(queryDB) {
            poolTemp.query(query3, {}, function(err, results) {
                if (err){
                    return queryDB(err)
                }else{
                    formData.table3 = results;
                    queryDB()
                }

            })
        },
        function(queryDB) {
            poolTemp.query(query4, {}, function(err, results) {
                if (err){
                    return queryDB(err)
                }else{
                    formData.table4 = results;
                    queryDB()
                }

            })
        },
        function(queryDB) {
            poolTemp.query(query5, {}, function(err, results) {
                if (err){
                    return queryDB(err)
                }else{
                    formData.table5 = results;
                    queryDB()
                }

            })
        },
        function(queryDB) {
            poolTemp.query(query6, {}, function(err, results) {
                if (err){
                    return queryDB(err)
                }else{
                    formData.table6 = results;
                    queryDB()
                }

            })
        },
        function(queryDB) {
            poolTemp.query(query7, {}, function(err, results) {
                if (err){
                    return queryDB(err)
                }else{
                    formData.table7 = results;
                    queryDB()
                }

            })
        },
        function(queryDB) {
            poolTemp.query(query8, {}, function(err, results) {
                if (err){
                    return queryDB(err)
                }else{
                    formData.table8 = results;
                    queryDB()
                }

            })
        },
        function(queryDB) {
            poolTemp.query(query9, {}, function(err, results) {
                if (err){
                    return queryDB(err)
                }else{
                    formData.table9 = results;
                    queryDB()
                }

            })
        },
        function(queryDB) {
            poolTemp.query(query10, {}, function(err, results) {
                if (err){
                    return queryDB(err)
                }else{
                    formData.table10 = results;
                    queryDB()
                }

            })
        },
        function(queryDB) {
            poolTemp.query(query11, {}, function(err, results) {
                if (err){
                    return queryDB(err)
                }else{
                    formData.table11 = results;
                    queryDB()
                }

            })
        },
        function(queryDB) {
            poolTemp.query(query12, {}, function(err, results) {
                if (err){
                    return queryDB(err)
                }else{
                    formData.table12 = results;
                    queryDB()
                }

            })
        },
        function(queryDB) {
            poolTemp.query(query13, {}, function(err, results) {
                if (err){
                    return queryDB(err)
                }else{
                    formData.table13 = results;
                    queryDB()

                }

            })
        },
        function(queryDB) {
            poolTemp.query(query14, {}, function(err, results) {
                if (err){
                    return queryDB(err)
                }else{
                    formData.table14 = results;
                    queryDB()

                }

            })
        },
        function(queryDB) {
            poolTemp.query(query15, {}, function(err, results) {
                if (err){
                    return queryDB(err)
                }else{
                    formData.table15 = results;
                    queryDB()

                }

            })
        },
        function(queryDB) {
            poolTemp.query(query16, {}, function(err, results) {
                if (err){
                    return queryDB(err)
                }else{
                    formData.table16 = results;
                    queryDB()

                }

            })
        }

     ], function(err) {
          if (err){
            res.json({"error": err})
          }else{
            funderQueries(formData.table14)
          }
     })


     function funderQueries(funderData){
        var final = 0
        //nest them here
        funderData.forEach(funder => {
          var query15 = 'SELECT * FROM funderasiabases WHERE funderName =' + sql.escape(funder.funderName)
          var query16 = 'SELECT * FROM funderasiaoperations WHERE funderName =' + sql.escape(funder.funderName)
          var query17 = 'SELECT * FROM fundereducationsubsectors WHERE funderName =' + sql.escape(funder.funderName)
          var query18 = 'SELECT * FROM funderinternationalbases WHERE funderName =' + sql.escape(funder.funderName)
          var query19 = 'SELECT * FROM funderorganizationtraits WHERE funderName =' + sql.escape(funder.funderName)

          async.parallel([
              function(queryDB) {
                  poolTemp.query(query15, {}, function(err, results) {
                      if (err){
                          return queryDB(err, null);
                      }else{
                          queryDB(null, results);
                      }

                  })
              },
              function(queryDB) {
                  poolTemp.query(query16, {}, function(err, results) {
                      if (err){
                          return queryDB(err, null);
                      }else{
                          queryDB(null, results);
                      }

                  })
              },
              function(queryDB) {
                  poolTemp.query(query17, {}, function(err, results) {
                      if (err){
                          return queryDB(err, null);
                      }else{
                          queryDB(null, results);
                      }

                  })
              },
              function(queryDB) {
                  poolTemp.query(query18, {}, function(err, results) {
                      if (err){
                          return queryDB(err, null);
                      }else{
                          queryDB(null, results);
                      }

                  })
              },
              function(queryDB) {
                  poolTemp.query(query19, {}, function(err, results) {
                      if (err){
                          return queryDB(err, null);
                      }else{
                          queryDB(null, results);
                      }
                  })
              }
          ],

          function(err, results) {
              if (err){
                res.json(err);
              }else{
                  final++;
                  //push results here to avoid duplicated parallel writes to funderIndividual array
                  funderIndividual.push(results);
                  formData.funderIndividual = funderIndividual;

                  if(final == funderData.length)
                      res.json(formData);
              }
          })
        })
    }
  } else {
    res.json({"error": "Error: Not authorized to access this page"})
  }
})

//POST new form to temp DB
dashboard.post('/submit-form-temp', (req, res) =>{
  if(req.user) {
    const formData = {
        // single val funder
        funderName: req.body.fname, //f
        funderUrl: req.body.furl, //f
        funderMotive: req.body.motive, //f
        funderImpact: req.body.impact, //f
        funderOrganizationForm: req.body.organizationForm, //f
        // multi val funder
        funderInternationalBases: req.body.internationalBases, //f
        funderEducationSubsector: req.body.edSubs, //f
        funderOrgTraits: req.body.orgTraits, //f
        funderAsiaBases: req.body.asialBases, //f
        funderAsiaOperations: req.body.asiaOperations, //f
        // single val initiative
        initiativeName: req.body.initName, //in
        initiativeURL: req.body.initURL, //in
        initiativeTargetsWomen: req.body.tWomen, //in
        initiativeStart: req.body.initStart, //in
        initiativeEnd: req.body.initEnd, //in
        initiativeDescription: req.body.idescription, //in
        initiativeProgramAreas: req.body.programArea, //in
        initiativeMainProgramActivity: req.body.initativeMainProgramActivity, //in
        initiativeFeeAccess: req.body.feeAccess, //in
        // multi val initiative
        initiativeRegions: req.body.regions, //in
        initiativeCountries: req.body.countries, //in
        initiativeActivities: req.body.activities, //in
        initiativeSourceOfFees: req.body.sourceOfFees, //in
        initiativeLaunchCountry: req.body.launchCountry, //in
        initiativeTargetGeo: req.body.targetGeos, //in
        initiativetargetPopulationSector: req.body.targetPopulationSectors, //in
        initiativeOutcomesMonitored: req.body.outcomesMonitored, //in
        initiativeMEdSubs: req.body.mEdSubs, //in
        initiativeOEdSubs: req.body.oEdSubs, //in
        initiativeManagementTypes: req.body.managementTypes, //in
        // single val implementer
        implementorName: req.body.iname, //im
        implementorMotive: req.body.impMotive, //im
        // single val other
        comments: req.body.comments, //other
        needsReview: req.body.needsReview, //other
        inDB: req.body.inDB,

        //section Reviews
        funderNameApproval: req.body.fnameA,
        funderUrlApproval: req.body.furlA,
        funderMotiveApproval: req.body.motiveA,
        funderImpactApproval: req.body.impactA,
        funderOrganizationFormApproval: req.body.organizationFormA,
        funderInternationalBaseApproval: req.body.internationalBasesA,
        funderEdSubsApproval: req.body.edSubsA,
        funderOrgTraitsApproval: req.body.orgTraitsA,
        funderAsiaBasesApproval: req.body.asialBasesA,
        funderAsiaOperationsApproval: req.body.asiaOperationsA,
        initNameApproval:req.body.initNameA,
        initUrlApproval: req.body.initURLA,
        initTargetsWomenApproval: req.body.tWomenA,
        initStartApproval: req.body.initStartA,
        initEndApproval: req.body.initEndA,
        initDescriptionApproval: req.body.idescriptionA,
        initProgramAreasApproval: req.body.programAreaA,
        initMainProgramActivityApproval: req.body.initiativeMainProgramActivityA,
        initFeeAccessApproval: req.body.feeAccessA,
        initRegionsApproval: req.body.regionsA,
        initCountriesApproval: req.body.countriesA,
        initActivitiesApproval:  req.body.activitiesA,
        initSourceOfFeesApproval: req.body.sourceOfFeesA,
        initLaunchCountryApproval: req.body.launchCountryA,
        initTargetGeoApproval: req.body.targetGeosA,
        initTargetPopulationSectorApproval: req.body.targetPopulationSectorsA,
        initOutcomesMonitoredApproval: req.body.outcomesMonitoredA,
        initMEdSubsApproval: req.body.mEdSubsA,
        initOEdSubsApproval:  req.body.oEdSubsA,
        initManagementTypesApproval: req.body.managementTypesA,
        implementorNameApproval: req.body.inameA,
        implementorMotiveApproval: req.body.impMotiveA

    }

   //Insert funder data
  var query1 = 'INSERT into funder VALUES (' + sql.escape(formData.funderName) + ',' + sql.escape(formData.funderUrl) + ',' + sql.escape(formData.funderMotive) + ',' + sql.escape(formData.funderImpact) + ',' + sql.escape(formData.funderOrganizationForm) + ')'
  console.log(query1);
  async.parallel([
    function(queryDB) {
        poolTemp.query(query1, function(err, results) {
            if (err){
                return queryDB(err)
            }else{
                queryDB()
            }

        })
    },

    ], function(err) {
        if (err){
            console.log(err)
        }

    })

   //Insert funder international bases data
   for(var i = 0; i <formData.funderInternationalBases.length; i++) {
        var query2 = 'INSERT into funderinternationalbases VALUES (' + sql.escape(formData.funderName) + ',' + sql.escape(formData.funderInternationalBases[i]) + ')'
        //console.log(query2)
        async.parallel([
            function(queryDB) {
                poolTemp.query(query2, {}, function(err, results) {
                    if (err){
                        return queryDB(err)
                    }else{
                        queryDB()
                    }

                })
            },

        ], function(err) {
            if (err){
                console.log(err)
            }

    })
    }

    //Insert funder education subsector data
  for(var i = 0; i <formData.funderEducationSubsector.length; i++) {
    var query3 = 'INSERT into fundereducationsubsectors VALUES (' + sql.escape(formData.funderName) + ',' + sql.escape(formData.funderEducationSubsector[i]) + ')'
    async.parallel([
        function(queryDB) {
            poolTemp.query(query3, {}, function(err, results) {
                if (err){
                    return queryDB(err)
                }else{
                    queryDB()
                }

            })
        },

    ], function(err) {
        if (err){
            console.log(err)
        }

    })
    }

    //Insert funder education organizational traits data
   for(var i = 0; i <formData.funderOrgTraits.length; i++) {
    var query4 = 'INSERT into funderorganizationtraits VALUES (' + sql.escape(formData.funderName) + ',' + sql.escape(formData.funderOrgTraits[i]) + ')'
    async.parallel([
        function(queryDB) {
            poolTemp.query(query4, {}, function(err, results) {
                if (err){
                    return queryDB(err)
                }else{
                    queryDB()
                }

            })
        },

    ], function(err) {
        if (err){
            console.log(err)
        }

    })
    }

    //Insert funder education funder asia bases data
   for(var i = 0; i <formData.funderAsiaBases.length; i++) {
    var query5 = 'INSERT into funderasiabases VALUES (' + sql.escape(formData.funderName) + ',' + sql.escape(formData.funderAsiaBases[i]) + ')'
    async.parallel([
        function(queryDB) {
            poolTemp.query(query5, {}, function(err, results) {
                if (err){
                    return queryDB(err)
                }else{
                    queryDB()
                }

            })
        },

    ], function(err) {
        if (err){
            console.log(err)
        }

    })
    }

    //Insert funder education funder asia operations data
   for(var i = 0; i < formData.funderAsiaOperations.length; i++) {
    var query6 = 'INSERT into funderasiaoperations VALUES (' + sql.escape(formData.funderName) + ',' + sql.escape(formData.funderAsiaOperations[i])+')'
    async.parallel([
        function(queryDB) {
            poolTemp.query(query6, {}, function(err, results) {
                if (err){
                    return queryDB(err)
                }else{
                    queryDB()
                }

            })
        },

    ], function(err) {
        if (err){
            console.log(err)
        }

    })
    }

    //Insert initative data
    test = client.get('tagNumber', function(err, reply){
        function1(reply)
    })

   function function1(val){
        query7 = 'INSERT into initiative VALUES ('+ sql.escape(val) +','+ sql.escape(formData.initiativeName) + ',' + sql.escape(formData.initiativeURL) + ',' + sql.escape(formData.initiativeTargetsWomen) +
        ',' + sql.escape(formData.initiativeStart) + ',' + sql.escape(formData.initiativeEnd) + ',' + sql.escape(formData.initiativeDescription) +
        ',(SELECT programArea FROM programarea WHERE programArea =' + sql.escape(formData.initiativeProgramAreas) +
        ' AND activity = ' + sql.escape(formData.initiativeMainProgramActivity) + '), (SELECT programmingActivity FROM programmingactivity WHERE programmingActivity = ' + sql.escape(formData.initiativeMainProgramActivity) + '),' + sql.escape(formData.initiativeFeeAccess) + ')'
        async.parallel([
        function(queryDB) {
            poolTemp.query(query7, {}, function(err, results) {
                if (err){
                    return queryDB(err)
                }else{
                    queryDB()
                }

            })
        },

        ], function(err) {
            if (err){
                console.log(err)
            }

        })
    }

     //Insert initiative region data
     test = client.get('tagNumber', function(err, reply){
       function2(reply)
    })

   function function2(val){
      const countryRegions = [];
      for (var i = 0; i < formData.initiativeRegions.length; i++) {
        for (var j = 0; j < formData.initiativeCountries.length; j++) {
          //Add each region and just ONE of its associated countries as object into the countryRegions list
          const regionFound = countryRegions.find(region => region.region == formData.initiativeRegions[i] && region.country == formData.initiativeCountries[j]);
          if (regionFound === undefined) {
            countryRegions.push({region: formData.initiativeRegions[i], country: formData.initiativeCountries[j] })
          }
        }
      }

      //Retrieve the region names required to be inserted
      async.map(countryRegions, function(region, queryDB) {
          poolTemp.query('SELECT regionName from regions WHERE regionName = ' + sql.escape(region.region) + ' AND includedCountry = ' + sql.escape(region.country), {}, function(err, results) {
            if (err) {
              return queryDB(err, null)
            } else {
              queryDB(null, results)
            }
          })
        }, function(err, results) {
          if (err) {
            console.log(err);
          } else {
            let res = JSON.parse(JSON.stringify(results));
            const regions = [];
            res.forEach(regionListing => {
              if (regionListing.length > 0) {
                regions.push(regionListing[0].regionName);
              }
            });
            regionsFiltered = [...new Set(regions)];
            //Insert filtered out region data
            async.map(regionsFiltered, function(region, queryDB) {
              poolTemp.query('INSERT into initiativeregion VALUES ('+ sql.escape(val) + ',' + sql.escape(region) + ')', {}, function(err, results) {
                if (err) {
                  return queryDB(err, null)
                } else {
                  queryDB(null, results)
                }
              })
            }, function(err, results) {
              if (err) {
                console.log(err)
              }
            })
          }
      })
   }



//      //Insert initiative country of operation data
     test = client.get('tagNumber', function(err, reply){
       function3(reply)
    })

   function function3(val){
   for(var i = 0; i < formData.initiativeCountries.length; i++) {
    var query9 = 'INSERT into initiativecountryofoperation VALUES ( ' + sql.escape(val) + ', (SELECT countryName from country WHERE countryName=' + sql.escape(formData.initiativeCountries[i]) + '))'
    async.parallel([
        function(queryDB) {
            poolTemp.query(query9, {}, function(err, results) {
                if (err){
                    return queryDB(err)
                }else{
                    queryDB()
                }

            })
        },

    ], function(err) {
        if (err){
            console.log(err)
        }

    })
    }
    }

     //Insert initiative programming activity data
     test = client.get('tagNumber', function(err, reply){
       function4(reply)
    })

   function function4(val){
   for(var i = 0; i < formData.initiativeActivities.length; i++) {
    var query10 = 'INSERT into initiativeprogrammingactivities VALUES (' + sql.escape(val) + ',' + sql.escape(formData.initiativeActivities[i]) + ')'
    async.parallel([
        function(queryDB) {
            poolTemp.query(query10, {}, function(err, results) {
                if (err){
                    return queryDB(err)
                }else{
                    queryDB()
                }

            })
        },

    ], function(err) {
        if (err){
            console.log(err)
        }

    })
    }
    }

   //Insert initiative source of fees data
   test = client.get('tagNumber', function(err, reply){
   function5(reply)
})

function function5(val){
   for(var i = 0; i < formData.initiativeSourceOfFees.length; i++) {
    var query11= 'INSERT into initiativefundingsource VALUES (' + sql.escape(val) + ',' + sql.escape(formData.initiativeSourceOfFees[i]) + ')'
    async.parallel([
        function(queryDB) {
            poolTemp.query(query11, {}, function(err, results) {
                if (err){
                    return queryDB(err)
                }else{
                    queryDB()
                }

            })
        },

    ], function(err) {
        if (err){
            console.log(err)
        }

    })
    }
    }

//     //Insert initiative launch country data
    test = client.get('tagNumber', function(err, reply){
       function6(reply)
    })

   function function6(val){
   for(var i = 0; i < formData.initiativeLaunchCountry.length; i++) {
    var query12 =  'INSERT into initiativelaunchcountry VALUES (' + sql.escape(val) + ',(SELECT countryName from country WHERE countryName=' + sql.escape(formData.initiativeLaunchCountry[i]) + '))'
    async.parallel([
        function(queryDB) {
            poolTemp.query(query12, {}, function(err, results) {
                if (err){
                    return queryDB(err)
                }else{
                    queryDB()
                }

            })
        },

    ], function(err) {
        if (err){
            console.log(err)
        }

    })
    }
    }

     //Insert initiative target geo data
     test = client.get('tagNumber', function(err, reply){
       function7(reply)
    })

   function function7(val){
   for(var i = 0; i < formData.initiativeTargetGeo.length; i++) {
    var query13 = 'INSERT into initiativetargetgeography VALUES ( ' + sql.escape(val) + ',' + sql.escape(formData.initiativeTargetGeo[i]) + ')'
    async.parallel([
        function(queryDB) {
            poolTemp.query(query13, {}, function(err, results) {
                if (err){
                    return queryDB(err)
                }else{
                    queryDB()
                }

            })
        },

    ], function(err) {
        if (err){
            console.log(err)
        }

    })
    }
    }

//      //Insert initiative target population sector data
     test = client.get('tagNumber', function(err, reply){
       function8(reply)
    })

   function function8(val){
   for(var i = 0; i < formData.initiativetargetPopulationSector.length; i++) {
    var query14 = 'INSERT into initiativetargetpopulationsector VALUES (' + sql.escape(val) + ',' + sql.escape(formData.initiativetargetPopulationSector[i]) + ')'
    async.parallel([
        function(queryDB) {
            poolTemp.query(query14, {}, function(err, results) {
                if (err){
                    return queryDB(err)
                }else{
                    queryDB()
                }

            })
        },

    ], function(err) {
        if (err){
            console.log(err)
        }

    })
    }
    }

    //Insert initiative outcomes monitored data
     test = client.get('tagNumber', function(err, reply){
       function9(reply)
    })

   function function9(val){
   for(var i = 0; i < formData.initiativeOutcomesMonitored.length; i++) {
    var query15 = 'INSERT into initiativemonitoredoutcomes VALUES (' + sql.escape(val) + ',' + sql.escape(formData.initiativeOutcomesMonitored[i]) + ')'
    async.parallel([
        function(queryDB) {
            poolTemp.query(query15, {}, function(err, results) {
                if (err){
                    return queryDB(err)
                }else{
                    queryDB()
                }

            })
        },

    ], function(err) {
        if (err){
            console.log(err)
        }

    })
    }
    }


     //Insert initiative main education subsector data
     test = client.get('tagNumber', function(err, reply){
       function10(reply)
    })

   function function10(val){
   for(var i = 0; i < formData.initiativeMEdSubs.length; i++) {
    var query16 = 'INSERT into initiativemaineducationsubsector VALUES (' + sql.escape(val) +
    ',(SELECT educationSubsector FROM educationsubsector WHERE educationSubsector =' + sql.escape(formData.initiativeMEdSubs[i]) + '))'
    async.parallel([
        function(queryDB) {
            poolTemp.query(query16, {}, function(err, results) {
                if (err){
                    return queryDB(err)
                }else{
                    queryDB()
                }

            })
        },

    ], function(err) {
        if (err){
            console.log(err)
        }

    })
    }
    }

      //Insert initiative education subsector data
     test = client.get('tagNumber', function(err, reply){
       function11(reply)
    })

   function function11(val){
   for(var i = 0; i < formData.initiativeOEdSubs.length; i++) {
    var query17 = 'INSERT into initiativeeducationsubsectors VALUES (' + sql.escape(val) +
    ',(SELECT educationSubsector FROM educationsubsector WHERE educationSubsector =' + sql.escape(formData.initiativeOEdSubs[i]) + '))'
    async.parallel([
        function(queryDB) {
            poolTemp.query(query17, {}, function(err, results) {
                if (err){
                    return queryDB(err)
                }else{
                    queryDB()
                }

            })
        },

    ], function(err) {
        if (err){
            console.log(err)
        }

    })
    }
    }

     //Insert initiative target management t data
     test = client.get('tagNumber', function(err, reply){
       function12(reply)
    })

   function function12(val){
   for(var i = 0; i < formData.initiativeManagementTypes.length; i++) {
    var query18 = 'INSERT into initiativetargetschoolmanagement VALUES (' + sql.escape(val) + ',' + sql.escape(formData.initiativeManagementTypes[i]) + ')'
    async.parallel([
        function(queryDB) {
            poolTemp.query(query18, {}, function(err, results) {
                if (err){
                    return queryDB(err)
                }else{
                    queryDB()
                }

            })
        },

    ], function(err) {
        if (err){
            console.log(err)
        }

    })
    }
    }

    //implementor queries
    var query19 = 'INSERT INTO implementor VALUES (' + sql.escape(formData.implementorName) + ',' + sql.escape(formData.implementorMotive) + ')'
    async.parallel([
        function(queryDB) {
            poolTemp.query(query19, {}, function(err, results) {
                if (err){
                    return queryDB(err)
                }else{
                    queryDB()
                }

            })
        },

        ], function(err) {
            if (err){
                console.log(err)
            }

        })


    test = client.get('tagNumber', function(err, reply){
       function13(reply)
    })

   function function13(val){

  // funder - funds - relationship
    var query20 = 'INSERT INTO funds VALUES (' + sql.escape(val) + ','
    + sql.escape(formData.funderName) + ',' + sql.escape(formData.initiativeStart) + ',' + sql.escape(formData.initiativeEnd) + ')'

    // //implementor - implements - initiative
    var query21 = 'INSERT INTO implements VALUES (' + sql.escape(val) + ',' +
    sql.escape(formData.implementorName) + ',' + sql.escape(formData.initiativeStart) + ',' + sql.escape(formData.initiativeEnd) + ')'

    async.parallel([
        function(queryDB) {
            poolTemp.query(query20, {}, function(err, results) {
                if (err){
                    return queryDB(err)
                }else{
                    queryDB()
                }

            })
        },
        function(queryDB) {
            poolTemp.query(query21, {}, function(err, results) {
                if (err){
                    return queryDB(err)
                }else{
                    queryDB()
                }

            })
        },

        ], function(err) {
            if (err){
                console.log(err)
            }

        })
    }

    test = client.get('tagNumber', function(err, reply){
        function15(reply)
    })

   function function15(val){
    var query22 = 'INSERT INTO comments VALUES (' + sql.escape(val) + ',' + sql.escape(formData.comments) + ')'
    async.parallel([
        function(queryDB) {
            poolTemp.query(query22, {}, function(err, results) {
                if (err){
                    return queryDB(err)
                }else{
                    queryDB()
                }

            })
        },

        ], function(err) {
            if (err){
                console.log(err)
            }

        })
   }

   test = client.get('tagNumber', function(err, reply){
    function16(reply)
    })

function function16(val){
        var query23 = 'INSERT INTO status VALUES ('+ sql.escape(val) + ',' + sql.escape(formData.inDB) + ',' + sql.escape(formData.needsReview) +')'
        async.parallel([
            function(queryDB) {
                poolTemp.query(query23, {}, function(err, results) {
                    if (err){
                        return queryDB(err)
                    }else{
                        queryDB()
                    }

                })
            },

            ], function(err) {
                if (err){
                    console.log(err)
                }

            })
    }

    test = client.get('tagNumber', function(err, reply){
        function17(reply)
    })

   function function17(val){
        var query24 = 'INSERT INTO sectionreviews VALUES (' + sql.escape(val) + ',' +
        sql.escape(formData.funderNameApproval) + ',' +
        sql.escape(formData.funderUrlApproval) + ',' +
        sql.escape(formData.funderMotiveApproval) + ',' +
        sql.escape(formData.funderImpactApproval) + ',' +
        sql.escape(formData.funderOrganizationFormApproval) + ',' +
        sql.escape(formData.funderInternationalBaseApproval) + ',' +
        sql.escape(formData.funderEdSubsApproval) + ',' +
        sql.escape(formData.funderOrgTraitsApproval) + ',' +
        sql.escape(formData.funderAsiaBasesApproval) + ',' +
        sql.escape(formData.funderAsiaOperationsApproval) + ',' +
        sql.escape(formData.initNameApproval) + ',' +
        sql.escape(formData.initUrlApproval) + ',' +
        sql.escape(formData.initTargetsWomenApproval) + ',' +
        sql.escape(formData.initStartApproval) + ',' +
        sql.escape(formData.initEndApproval) + ',' +
        sql.escape(formData.initDescriptionApproval) + ',' +
        sql.escape(formData.initProgramAreasApproval) + ',' +
        sql.escape(formData.initMainProgramActivityApproval) + ',' +
        sql.escape(formData.initFeeAccessApproval) + ',' +
        sql.escape(formData.initRegionsApproval) + ',' +
        sql.escape(formData.initCountriesApproval) + ',' +
        sql.escape(formData.initActivitiesApproval) + ',' +
        sql.escape(formData.initSourceOfFeesApproval) + ',' +
        sql.escape(formData.initLaunchCountryApproval) + ',' +
        sql.escape(formData.initTargetGeoApproval) + ',' +
        sql.escape(formData.initTargetPopulationSectorApproval) + ',' +
        sql.escape(formData.initOutcomesMonitoredApproval) + ',' +
        sql.escape(formData.initMEdSubsApproval) + ',' +
        sql.escape(formData.initOEdSubsApproval) + ',' +
        sql.escape(formData.initManagementTypesApproval) + ',' +
        sql.escape(formData.implementorNameApproval) + ',' +
        sql.escape(formData.implementorMotiveApproval) + ')'


        async.parallel([
            function(queryDB) {
                poolTemp.query(query24, {}, function(err, results) {
                    if (err){
                        return queryDB(err)
                    }else{
                        queryDB()
                    }

                })
            },

            ], function(err) {
                if (err){
                    console.log(err)
                }

            })
    }

    client.exists('tagNumber', function(err, reply){
        if(reply != 1){
           client.set('tagNumber', 1521)
        }else{
            client.incr('tagNumber')
            client.get('tagNumber', function(err, reply){
              console.log(reply)
            })
        }
    })

    res.json("Form successfully added to the DB")
  } else {
    res.json({"error": "Error: Action not authorized"})
  }
})

//POST new form to DB
dashboard.post('/submitform', (req, res) =>{
  if(req.user){
    const formData = {
        // single val funder
        funderName: req.body.fname, //f
        funderUrl: req.body.furl, //f
        funderMotive: req.body.motive, //f
        funderImpact: req.body.impact, //f
        funderOrganizationForm: req.body.organizationForm, //f
        // multi val funder
        funderInternationalBases: req.body.internationalBases, //f
        funderEducationSubsector: req.body.edSubs, //f
        funderOrgTraits: req.body.orgTraits, //f
        funderAsiaBases: req.body.asialBases, //f
        funderAsiaOperations: req.body.asiaOperations, //f
        // single val initiative
        initiativeName: req.body.initName, //in
        initiativeURL: req.body.initURL, //in
        initiativeTargetsWomen: req.body.tWomen, //in
        initiativeStart: req.body.initStart, //in
        initiativeEnd: req.body.initEnd, //in
        initiativeDescription: req.body.idescription, //in
        initiativeProgramAreas: req.body.programArea, //in
        initiativeMainProgramActivity: req.body.initativeMainProgramActivity, //in
        initiativeFeeAccess: req.body.feeAccess, //in
        // multi val initiative
        initiativeRegions: req.body.regions, //in
        initiativeCountries: req.body.countries, //in
        initiativeActivities: req.body.activities, //in
        initiativeSourceOfFees: req.body.sourceOfFees, //in
        initiativeLaunchCountry: req.body.launchCountry, //in
        initiativeTargetGeo: req.body.targetGeos, //in
        initiativetargetPopulationSector: req.body.targetPopulationSectors, //in
        initiativeOutcomesMonitored: req.body.outcomesMonitored, //in
        initiativeMEdSubs: req.body.mEdSubs, //in
        initiativeOEdSubs: req.body.oEdSubs, //in
        initiativeManagementTypes: req.body.managementTypes, //in
        // single val implementer
        implementorName: req.body.iname, //im
        implementorMotive: req.body.impMotive, //im
    }

    //Insert funder data
   var query1 = 'INSERT into funder VALUES (' + sql.escape(formData.funderName) + ',' + sql.escape(formData.funderUrl) + ',' + sql.escape(formData.funderMotive) + ',' + sql.escape(formData.funderImpact) + ',' + sql.escape(formData.funderOrganizationForm) + ')'
   console.log(query1);
   async.parallel([
     function(queryDB) {
         pool.query(query1, function(err, results) {
             if (err){
                 return queryDB(err)
             }else{
                 queryDB()
             }

         })
     },

     ], function(err) {
         if (err){
             console.log(err)
         }

     })

    //Insert funder international bases data
    for(var i = 0; i <formData.funderInternationalBases.length; i++) {
         var query2 = 'INSERT into funderinternationalbases VALUES (' + sql.escape(formData.funderName) + ',' + sql.escape(formData.funderInternationalBases[i]) + ')'
         //console.log(query2)
         async.parallel([
             function(queryDB) {
                 pool.query(query2, {}, function(err, results) {
                     if (err){
                         return queryDB(err)
                     }else{
                         queryDB()
                     }

                 })
             },

         ], function(err) {
             if (err){
                 console.log(err)
             }

     })
     }

     //Insert funder education subsector data
   for(var i = 0; i <formData.funderEducationSubsector.length; i++) {
     var query3 = 'INSERT into fundereducationsubsectors VALUES (' + sql.escape(formData.funderName) + ',' + sql.escape(formData.funderEducationSubsector[i]) + ')'
     async.parallel([
         function(queryDB) {
             pool.query(query3, {}, function(err, results) {
                 if (err){
                     return queryDB(err)
                 }else{
                     queryDB()
                 }

             })
         },

     ], function(err) {
         if (err){
             console.log(err)
         }

     })
     }

     //Insert funder education organizational traits data
    for(var i = 0; i <formData.funderOrgTraits.length; i++) {
     var query4 = 'INSERT into funderorganizationtraits VALUES (' + sql.escape(formData.funderName) + ',' + sql.escape(formData.funderOrgTraits[i]) + ')'
     async.parallel([
         function(queryDB) {
             pool.query(query4, {}, function(err, results) {
                 if (err){
                     return queryDB(err)
                 }else{
                     queryDB()
                 }

             })
         },

     ], function(err) {
         if (err){
             console.log(err)
         }

     })
     }

     //Insert funder education funder asia bases data
    for(var i = 0; i <formData.funderAsiaBases.length; i++) {
     var query5 = 'INSERT into funderasiabases VALUES (' + sql.escape(formData.funderName) + ',' + sql.escape(formData.funderAsiaBases[i]) + ')'
     async.parallel([
         function(queryDB) {
             pool.query(query5, {}, function(err, results) {
                 if (err){
                     return queryDB(err)
                 }else{
                     queryDB()
                 }

             })
         },

     ], function(err) {
         if (err){
             console.log(err)
         }

     })
     }

     //Insert funder education funder asia operations data
    for(var i = 0; i < formData.funderAsiaOperations.length; i++) {
     var query6 = 'INSERT into funderasiaoperations VALUES (' + sql.escape(formData.funderName) + ',' + sql.escape(formData.funderAsiaOperations[i])+')'
     async.parallel([
         function(queryDB) {
             pool.query(query6, {}, function(err, results) {
                 if (err){
                     return queryDB(err)
                 }else{
                     queryDB()
                 }

             })
         },

     ], function(err) {
         if (err){
             console.log(err)
         }

     })
     }

     //Insert initative data
     test = client.get('tagNumber', function(err, reply){
         function1(reply)
     })

    function function1(val){
         query7 = 'INSERT into initiative VALUES ('+ sql.escape(val) +','+ sql.escape(formData.initiativeName) + ',' + sql.escape(formData.initiativeURL) + ',' + sql.escape(formData.initiativeTargetsWomen) +
         ',' + sql.escape(formData.initiativeStart) + ',' + sql.escape(formData.initiativeEnd) + ',' + sql.escape(formData.initiativeDescription) +
         ',(SELECT programArea FROM programarea WHERE programArea =' + sql.escape(formData.initiativeProgramAreas) +
         ' AND activity = ' + sql.escape(formData.initiativeMainProgramActivity) + '), (SELECT programmingActivity FROM programmingactivity WHERE programmingActivity = ' + sql.escape(formData.initiativeMainProgramActivity) + '),' + sql.escape(formData.initiativeFeeAccess) + ')'
         async.parallel([
         function(queryDB) {
             pool.query(query7, {}, function(err, results) {
                 if (err){
                     return queryDB(err)
                 }else{
                     queryDB()
                 }

             })
         },

         ], function(err) {
             if (err){
                 console.log(err)
             }

         })
     }

      //Insert initiative region data
      test = client.get('tagNumber', function(err, reply){
        function2(reply)
     })

    function function2(val){
       const countryRegions = [];
       for (var i = 0; i < formData.initiativeRegions.length; i++) {
         for (var j = 0; j < formData.initiativeCountries.length; j++) {
           //Add each region and just ONE of its associated countries as object into the countryRegions list
           const regionFound = countryRegions.find(region => region.region == formData.initiativeRegions[i] && region.country == formData.initiativeCountries[j]);
           if (regionFound === undefined) {
             countryRegions.push({region: formData.initiativeRegions[i], country: formData.initiativeCountries[j] })
           }
         }
       }

       //Retrieve the region names required to be inserted
       async.map(countryRegions, function(region, queryDB) {
           pool.query('SELECT regionName from regions WHERE regionName = ' + sql.escape(region.region) + ' AND includedCountry = ' + sql.escape(region.country), {}, function(err, results) {
             if (err) {
               return queryDB(err, null)
             } else {
               queryDB(null, results)
             }
           })
         }, function(err, results) {
           if (err) {
             console.log(err);
           } else {
             let res = JSON.parse(JSON.stringify(results));
             const regions = [];
             res.forEach(regionListing => {
               if (regionListing.length > 0) {
                 regions.push(regionListing[0].regionName);
               }
             });
             regionsFiltered = [...new Set(regions)];
             //Insert filtered out region data
             async.map(regionsFiltered, function(region, queryDB) {
               pool.query('INSERT into initiativeregion VALUES ('+ sql.escape(val) + ',' + sql.escape(region) + ')', {}, function(err, results) {
                 if (err) {
                   return queryDB(err, null)
                 } else {
                   queryDB(null, results)
                 }
               })
             }, function(err, results) {
               if (err) {
                 console.log(err)
               }
             })
           }
       })
    }



 //      //Insert initiative country of operation data
      test = client.get('tagNumber', function(err, reply){
        function3(reply)
     })

    function function3(val){
    for(var i = 0; i < formData.initiativeCountries.length; i++) {
     var query9 = 'INSERT into initiativecountryofoperation VALUES ( ' + sql.escape(val) + ', (SELECT countryName from country WHERE countryName=' + sql.escape(formData.initiativeCountries[i]) + '))'
     async.parallel([
         function(queryDB) {
             pool.query(query9, {}, function(err, results) {
                 if (err){
                     return queryDB(err)
                 }else{
                     queryDB()
                 }

             })
         },

     ], function(err) {
         if (err){
             console.log(err)
         }

     })
     }
     }

      //Insert initiative programming activity data
      test = client.get('tagNumber', function(err, reply){
        function4(reply)
     })

    function function4(val){
    for(var i = 0; i < formData.initiativeActivities.length; i++) {
     var query10 = 'INSERT into initiativeprogrammingactivities VALUES (' + sql.escape(val) + ',' + sql.escape(formData.initiativeActivities[i]) + ')'
     async.parallel([
         function(queryDB) {
             pool.query(query10, {}, function(err, results) {
                 if (err){
                     return queryDB(err)
                 }else{
                     queryDB()
                 }

             })
         },

     ], function(err) {
         if (err){
             console.log(err)
         }

     })
     }
     }

    //Insert initiative source of fees data
    test = client.get('tagNumber', function(err, reply){
    function5(reply)
 })

 function function5(val){
    for(var i = 0; i < formData.initiativeSourceOfFees.length; i++) {
     var query11= 'INSERT into initiativefundingsource VALUES (' + sql.escape(val) + ',' + sql.escape(formData.initiativeSourceOfFees[i]) + ')'
     async.parallel([
         function(queryDB) {
             pool.query(query11, {}, function(err, results) {
                 if (err){
                     return queryDB(err)
                 }else{
                     queryDB()
                 }

             })
         },

     ], function(err) {
         if (err){
             console.log(err)
         }

     })
     }
     }

 //     //Insert initiative launch country data
     test = client.get('tagNumber', function(err, reply){
        function6(reply)
     })

    function function6(val){
    for(var i = 0; i < formData.initiativeLaunchCountry.length; i++) {
     var query12 =  'INSERT into initiativelaunchcountry VALUES (' + sql.escape(val) + ',(SELECT countryName from country WHERE countryName=' + sql.escape(formData.initiativeLaunchCountry[i]) + '))'
     async.parallel([
         function(queryDB) {
             pool.query(query12, {}, function(err, results) {
                 if (err){
                     return queryDB(err)
                 }else{
                     queryDB()
                 }

             })
         },

     ], function(err) {
         if (err){
             console.log(err)
         }

     })
     }
     }

      //Insert initiative target geo data
      test = client.get('tagNumber', function(err, reply){
        function7(reply)
     })

    function function7(val){
    for(var i = 0; i < formData.initiativeTargetGeo.length; i++) {
     var query13 = 'INSERT into initiativetargetgeography VALUES ( ' + sql.escape(val) + ',' + sql.escape(formData.initiativeTargetGeo[i]) + ')'
     async.parallel([
         function(queryDB) {
             pool.query(query13, {}, function(err, results) {
                 if (err){
                     return queryDB(err)
                 }else{
                     queryDB()
                 }

             })
         },

     ], function(err) {
         if (err){
             console.log(err)
         }

     })
     }
     }

 //      //Insert initiative target population sector data
      test = client.get('tagNumber', function(err, reply){
        function8(reply)
     })

    function function8(val){
    for(var i = 0; i < formData.initiativetargetPopulationSector.length; i++) {
     var query14 = 'INSERT into initiativetargetpopulationsector VALUES (' + sql.escape(val) + ',' + sql.escape(formData.initiativetargetPopulationSector[i]) + ')'
     async.parallel([
         function(queryDB) {
             pool.query(query14, {}, function(err, results) {
                 if (err){
                     return queryDB(err)
                 }else{
                     queryDB()
                 }

             })
         },

     ], function(err) {
         if (err){
             console.log(err)
         }

     })
     }
     }

     //Insert initiative outcomes monitored data
      test = client.get('tagNumber', function(err, reply){
        function9(reply)
     })

    function function9(val){
    for(var i = 0; i < formData.initiativeOutcomesMonitored.length; i++) {
     var query15 = 'INSERT into initiativemonitoredoutcomes VALUES (' + sql.escape(val) + ',' + sql.escape(formData.initiativeOutcomesMonitored[i]) + ')'
     async.parallel([
         function(queryDB) {
             pool.query(query15, {}, function(err, results) {
                 if (err){
                     return queryDB(err)
                 }else{
                     queryDB()
                 }

             })
         },

     ], function(err) {
         if (err){
             console.log(err)
         }

     })
     }
     }


      //Insert initiative main education subsector data
      test = client.get('tagNumber', function(err, reply){
        function10(reply)
     })

    function function10(val){
    for(var i = 0; i < formData.initiativeMEdSubs.length; i++) {
     var query16 = 'INSERT into initiativemaineducationsubsector VALUES (' + sql.escape(val) +
     ',(SELECT educationSubsector FROM educationsubsector WHERE educationSubsector =' + sql.escape(formData.initiativeMEdSubs[i]) + '))'
     async.parallel([
         function(queryDB) {
             pool.query(query16, {}, function(err, results) {
                 if (err){
                     return queryDB(err)
                 }else{
                     queryDB()
                 }

             })
         },

     ], function(err) {
         if (err){
             console.log(err)
         }

     })
     }
     }

       //Insert initiative education subsector data
      test = client.get('tagNumber', function(err, reply){
        function11(reply)
     })

    function function11(val){
    for(var i = 0; i < formData.initiativeOEdSubs.length; i++) {
     var query17 = 'INSERT into initiativeeducationsubsectors VALUES (' + sql.escape(val) +
     ',(SELECT educationSubsector FROM educationsubsector WHERE educationSubsector =' + sql.escape(formData.initiativeOEdSubs[i]) + '))'
     async.parallel([
         function(queryDB) {
             pool.query(query17, {}, function(err, results) {
                 if (err){
                     return queryDB(err)
                 }else{
                     queryDB()
                 }

             })
         },

     ], function(err) {
         if (err){
             console.log(err)
         }

     })
     }
     }

      //Insert initiative target management t data
      test = client.get('tagNumber', function(err, reply){
        function12(reply)
     })

    function function12(val){
    for(var i = 0; i < formData.initiativeManagementTypes.length; i++) {
     var query18 = 'INSERT into initiativetargetschoolmanagement VALUES (' + sql.escape(val) + ',' + sql.escape(formData.initiativeManagementTypes[i]) + ')'
     async.parallel([
         function(queryDB) {
             pool.query(query18, {}, function(err, results) {
                 if (err){
                     return queryDB(err)
                 }else{
                     queryDB()
                 }

             })
         },

     ], function(err) {
         if (err){
             console.log(err)
         }

     })
     }
     }

     //implementor queries
     var query19 = 'INSERT INTO implementor VALUES (' + sql.escape(formData.implementorName) + ',' + sql.escape(formData.implementorMotive) + ')'
     async.parallel([
         function(queryDB) {
             pool.query(query19, {}, function(err, results) {
                 if (err){
                     return queryDB(err)
                 }else{
                     queryDB()
                 }

             })
         },

         ], function(err) {
             if (err){
                 console.log(err)
             }

         })


     test = client.get('tagNumber', function(err, reply){
        function13(reply)
     })

    function function13(val){

   // funder - funds - relationship
     var query20 = 'INSERT INTO funds VALUES (' + sql.escape(val) + ','
     + sql.escape(formData.funderName) + ',' + sql.escape(formData.initiativeStart) + ',' + sql.escape(formData.initiativeEnd) + ')'

     // //implementor - implements - initiative
     var query21 = 'INSERT INTO implements VALUES (' + sql.escape(val) + ',' +
     sql.escape(formData.implementorName) + ',' + sql.escape(formData.initiativeStart) + ',' + sql.escape(formData.initiativeEnd) + ')'

     async.parallel([
         function(queryDB) {
             pool.query(query20, {}, function(err, results) {
                 if (err){
                     return queryDB(err)
                 }else{
                     queryDB()
                 }

             })
         },
         function(queryDB) {
             pool.query(query21, {}, function(err, results) {
                 if (err){
                     return queryDB(err)
                 }else{
                     queryDB()
                 }

             })
         },

         ], function(err) {
             if (err){
                 console.log(err)
             }

         })
     }

    client.exists('tagNumber', function(err, reply){
        if(reply != 1){
           client.set('tagNumber', 1521)
        }else{
            client.incr('tagNumber')
            client.get('tagNumber', function(err, reply){
              console.log(reply)
            })
        }
    })

    res.json("Form successfully added to the DB")
  } else {
    res.json({"error": "Error: Action not authorized"})
  }
})

dashboard.post('/update-form', (req, res) =>{
  if(req.user){
    const formData = {
        //original values
        tagNum: req.body.tagNum,
        OfunderName: req.body.ofname,
        OimplementorName: req.body.oiname,
        // single val funder
        funderName: req.body.fname, //f
        funderUrl: req.body.furl, //f
        funderMotive: req.body.motive, //f
        funderImpact: req.body.impact, //f
        funderOrganizationForm: req.body.organizationForm, //f
        // multi val funder
        funderInternationalBases: req.body.internationalBases, //f
        funderEducationSubsector: req.body.edSubs, //f
        funderOrgTraits: req.body.orgTraits, //f
        funderAsiaBases: req.body.asialBases, //f
        funderAsiaOperations: req.body.asiaOperations, //f
        // single val initiative
        initiativeName: req.body.initName, //in
        initiativeURL: req.body.initURL, //in
        initiativeTargetsWomen: req.body.tWomen, //in
        initiativeStart: req.body.initStart, //in
        initiativeEnd: req.body.initEnd, //in
        initiativeDescription: req.body.idescription, //in
        initiativeProgramAreas: req.body.programArea, //in
        initiativeMainProgramActivity: req.body.initativeMainProgramActivity, //in
        initiativeFeeAccess: req.body.feeAccess, //in
        // multi val initiative
        initiativeRegions: req.body.regions, //in
        initiativeCountries: req.body.countries, //in
        initiativeActivities: req.body.activities, //in
        initiativeSourceOfFees: req.body.sourceOfFees, //in
        initiativeLaunchCountry: req.body.launchCountry, //in
        initiativeTargetGeo: req.body.targetGeos, //in
        initiativetargetPopulationSector: req.body.targetPopulationSectors, //in
        initiativeOutcomesMonitored: req.body.outcomesMonitored, //in
        initiativeMEdSubs: req.body.mEdSubs, //in
        initiativeOEdSubs: req.body.oEdSubs, //in
        initiativeManagementTypes: req.body.managementTypes, //in
        // single val implementer
        implementorName: req.body.iname, //im
        implementorMotive: req.body.impMotive, //im
    }

    //Update funder data or insert new funder if funder funds other initiatives - if this is the case, don't want to replace(update) the funder
    var query1;
    var numFunderInitiatives;  //Number of initiatives funded by funder
    var numFunders //Number of funders by specified tag number
    var queryNumFunderInitiatives = 'SELECT COUNT(funderName) FROM funds WHERE funderName = ' + sql.escape(formData.OfunderName)  //Get number of initiatives funded by funder
    var queryNumFunders = 'SELECT COUNT(funderName) FROM funds WHERE tagNum = ' + sql.escape(formData.tagNum)  //Get number of funders specified by tag number

    async.parallel([
     function(queryDB) {
         pool.query(queryNumFunderInitiatives, {}, function(err, results) {
             if (err){
                 return queryDB(err, null)
             }else{
                 queryDB(null, results)
             }

         })
     },

    ], function(err, results) {
         if (err){
           res.json(err)
         } else {
           numFunderInitiatives = JSON.parse(JSON.stringify(results[0][0]['COUNT(funderName)']));

           //If funder existed in temp db already but doesn't exist in main db
           if (numFunderInitiatives == 0) {
             query1 = 'INSERT into funder VALUES (' + sql.escape(formData.funderName) + ',' + sql.escape(formData.funderUrl) + ',' + sql.escape(formData.funderMotive) + ',' + sql.escape(formData.funderImpact) + ',' + sql.escape(formData.funderOrganizationForm) + ')'
           } else {
             if (numFunderInitiatives > 1 && formData.funderName !== formData.OfunderName) {
               query1 = 'INSERT into funder VALUES (' + sql.escape(formData.funderName) + ',' + sql.escape(formData.funderUrl) + ',' + sql.escape(formData.funderMotive) + ',' + sql.escape(formData.funderImpact) + ',' + sql.escape(formData.funderOrganizationForm) + ')'
             }
             else {
               query1 = 'UPDATE funder SET funderName = ' + sql.escape(formData.funderName) + ', funderWebsite ='+ sql.escape(formData.funderUrl) +', profitMotive =' + sql.escape(formData.funderMotive) +', impactInvesting ='+ sql.escape(formData.funderImpact)
              +', organizationalForm ='+ sql.escape(formData.funderOrganizationForm) +' WHERE funderName = ' + sql.escape(formData.OfunderName)
            }
           }

           async.parallel([
            function(queryDB) {
                pool.query(query1, {}, function(err, results) {
                    if (err){
                        return queryDB(err)
                    }else{
                        queryDB()
                    }
                })
            },

            ], function(err) {
                if (err){
                    console.log(err)
                }
            })

            if (numFunderInitiatives <= 1 || formData.funderName == formData.OfunderName) {
              //delete all funder international base
              var query2 = 'DELETE FROM funderinternationalbases WHERE funderName = ' + sql.escape(formData.OfunderName)
              async.parallel([
                  function(queryDB) {
                      pool.query(query2, {}, function(err, results) {
                          if (err){
                              return queryDB(err)
                          }else{
                              queryDB()
                          }
                      })
                  },

                  ], function(err) {
                      if (err){
                          console.log(err)
                      } else {
                        //Insert funder international bases data
                        for(var i = 0; i <formData.funderInternationalBases.length; i++) {
                           var query3 = 'INSERT into funderinternationalbases VALUES (' + sql.escape(formData.funderName) + ',' + sql.escape(formData.funderInternationalBases[i]) + ')'
                           //console.log(query2)
                           async.parallel([
                               function(queryDB) {
                                   pool.query(query3, {}, function(err, results) {
                                       if (err){
                                           return queryDB(err)
                                       }else{
                                           //formData.table1 = results;
                                           queryDB()
                                       }
                                   })
                               },

                           ], function(err) {
                               if (err){
                                   console.log(err)
                               }
                           })
                         }
                      }
                })
            } else {
              //Insert funder international bases data
              for(var i = 0; i <formData.funderInternationalBases.length; i++) {
                 var query3 = 'INSERT into funderinternationalbases VALUES (' + sql.escape(formData.funderName) + ',' + sql.escape(formData.funderInternationalBases[i]) + ')'
                 //console.log(query2)
                 async.parallel([
                     function(queryDB) {
                         pool.query(query3, {}, function(err, results) {
                             if (err){
                                 return queryDB(err)
                             }else{
                                 //formData.table1 = results;
                                 queryDB()
                             }

                         })
                     },

                 ], function(err) {
                     if (err){
                         console.log(err)
                     }
                 })
               }
            }

            //delete all funder fundereducationsubsectors
            if (numFunderInitiatives <= 1 || formData.funderName == formData.OfunderName) {
              var query4 = 'DELETE FROM fundereducationsubsectors WHERE funderName = ' + sql.escape(formData.OfunderName)
              async.parallel([
                  function(queryDB) {
                      pool.query(query4, {}, function(err, results) {
                          if (err){
                              return queryDB(err)
                          }else{
                              queryDB()
                          }
                      })
                  },

                  ], function(err) {
                      if (err){
                          console.log(err)
                      } else {
                        //Insert funder education subsector data
                        for(var i = 0; i <formData.funderEducationSubsector.length; i++) {
                          var query5 = 'INSERT into fundereducationsubsectors VALUES (' + sql.escape(formData.funderName) + ',' + sql.escape(formData.funderEducationSubsector[i]) + ')'
                          async.parallel([
                              function(queryDB) {
                                  pool.query(query5, {}, function(err, results) {
                                      if (err){
                                          return queryDB(err)
                                      }else{
                                          //formData.table1 = results;
                                          queryDB()
                                      }
                                  })
                              },
                          ], function(err) {
                              if (err){
                                  console.log(err)
                              }
                            })
                        }
                      }

                  })
              } else {
                //Insert funder education subsector data
                for(var i = 0; i <formData.funderEducationSubsector.length; i++) {
                  var query5 = 'INSERT into fundereducationsubsectors VALUES (' + sql.escape(formData.funderName) + ',' + sql.escape(formData.funderEducationSubsector[i]) + ')'
                  async.parallel([
                      function(queryDB) {
                          pool.query(query5, {}, function(err, results) {
                              if (err){
                                  return queryDB(err)
                              }else{
                                  //formData.table1 = results;
                                  queryDB()
                              }
                          })
                      },

                  ], function(err) {
                      if (err){
                          console.log(err)
                      }
                    })
                }
              }


            if (numFunderInitiatives <= 1 || formData.funderName == formData.OfunderName) {
              //delete all funder funderorganizationtraits
              var query6 = 'DELETE FROM funderorganizationtraits WHERE funderName = ' + sql.escape(formData.OfunderName)
              async.parallel([
                  function(queryDB) {
                      pool.query(query6, {}, function(err, results) {
                          if (err){
                              return queryDB(err)
                          }else{
                              queryDB()
                          }

                      })
                  },

                  ], function(err) {
                      if (err){
                          console.log(err)
                      } else {
                        //Insert funder education organizational traits data
                        for(var i = 0; i <formData.funderOrgTraits.length; i++) {
                          var query7 = 'INSERT into funderorganizationtraits VALUES (' + sql.escape(formData.funderName) + ',' + sql.escape(formData.funderOrgTraits[i]) + ')'
                          async.parallel([
                              function(queryDB) {
                                  pool.query(query7, {}, function(err, results) {
                                      if (err){
                                          return queryDB(err)
                                      }else{
                                          //formData.table1 = results;
                                          queryDB()
                                      }
                                  })
                              },

                          ], function(err) {
                              if (err){
                                  console.log(err)
                              }
                          })
                        }
                      }
                  })
            } else {
              //Insert funder education organizational traits data
              for(var i = 0; i <formData.funderOrgTraits.length; i++) {
                var query7 = 'INSERT into funderorganizationtraits VALUES (' + sql.escape(formData.funderName) + ',' + sql.escape(formData.funderOrgTraits[i]) + ')'
                async.parallel([
                    function(queryDB) {
                        pool.query(query7, {}, function(err, results) {
                            if (err){
                                return queryDB(err)
                            }else{
                                //formData.table1 = results;
                                queryDB()
                            }

                        })
                    },

                ], function(err) {
                    if (err){
                        console.log(err)
                    }

                })
              }
            }


            if (numFunderInitiatives <= 1 || formData.funderName == formData.OfunderName) {
              //delete all funder asiabases
              var query8 = 'DELETE FROM funderasiabases WHERE funderName = ' + sql.escape(formData.OfunderName)
              async.parallel([
                  function(queryDB) {
                      pool.query(query8, {}, function(err, results) {
                          if (err){
                              return queryDB(err)
                          }else{
                              queryDB()
                          }

                      })
                  },

                  ], function(err) {
                      if (err){
                          console.log(err)
                      } else {
                        //Insert funder asia bases data
                        for(var i = 0; i <formData.funderAsiaBases.length; i++) {
                          var query9 = 'INSERT into funderasiabases VALUES (' + sql.escape(formData.funderName) + ',' + sql.escape(formData.funderAsiaBases[i])+ ')'
                          async.parallel([
                              function(queryDB) {
                                  pool.query(query9, {}, function(err, results) {
                                      if (err){
                                          return queryDB(err)
                                      }else{
                                          //formData.table1 = results;
                                          queryDB()
                                      }

                                  })
                              },

                          ], function(err) {
                              if (err){
                                  console.log(err)
                              }

                          })
                        }
                      }
                  })
            } else {
              //Insert funder asia bases data
              for(var i = 0; i <formData.funderAsiaBases.length; i++) {
                var query9 = 'INSERT into funderasiabases VALUES ('  + sql.escape(formData.funderName) + ',' + sql.escape(formData.funderAsiaBases[i])+ ')'
                async.parallel([
                    function(queryDB) {
                        pool.query(query9, {}, function(err, results) {
                            if (err){
                                return queryDB(err)
                            }else{
                                //formData.table1 = results;
                                queryDB()
                            }
                        })
                    },

                ], function(err) {
                    if (err){
                        console.log(err)
                    }

                })
              }
            }

            if (numFunderInitiatives <= 1 || formData.funderName == formData.OfunderName) {
              //delete all funder asia operations
              var query10= 'DELETE FROM funderasiaoperations WHERE funderName = ' + sql.escape(formData.OfunderName)
              async.parallel([
                  function(queryDB) {
                      pool.query(query10, {}, function(err, results) {
                          if (err){
                              return queryDB(err)
                          }else{

                              queryDB()
                          }

                      })
                  },

                  ], function(err) {
                      if (err){
                          console.log(err)
                      } else {
                        //Insert funder education funder asia operations data
                        for(var i = 0; i < formData.funderAsiaOperations.length; i++) {
                          var query11 = 'INSERT into funderasiaoperations VALUES (' + sql.escape(formData.funderName) + ',' + sql.escape(formData.funderAsiaOperations[i])+ ')'
                          async.parallel([
                              function(queryDB) {
                                  pool.query(query11, {}, function(err, results) {
                                      if (err){
                                          return queryDB(err)
                                      }else{
                                          //sql.escape(formData.table1 = results;
                                          queryDB()
                                      }

                                  })
                              },

                          ], function(err) {
                              if (err){
                                  console.log(err)
                              }

                          })
                        }
                      }
                  })
            } else {
              //Insert funder education funder asia operations data
              for(var i = 0; i < formData.funderAsiaOperations.length; i++) {
                var query11 = 'INSERT into funderasiaoperations VALUES (' + sql.escape(formData.funderName) + ',' + sql.escape(formData.funderAsiaOperations[i])+ ')'
                async.parallel([
                    function(queryDB) {
                        pool.query(query11, {}, function(err, results) {
                            if (err){
                                return queryDB(err)
                            }else{
                                //formData.table1 = results;
                                queryDB()
                            }
                        })
                    },

                ], function(err) {
                    if (err){
                        console.log(err)
                    }
                })
              }
            }


            var query12;
            var queryNumInitiatives = 'SELECT COUNT(tagNumber) FROM initiative WHERE tagNumber = ' + sql.escape(formData.tagNum)  //Check if initiative exists in main db
            async.parallel([
              function(queryDB) {
                  pool.query(queryNumInitiatives, {}, function(err, results) {
                      if (err){
                          return queryDB(err, null)
                      }else{
                          queryDB(null, results)
                      }
                  })
              }
            ], function(err, results) {
                if (err){
                    console.log(err)
                } else {
                  let numInitiatives = JSON.parse(JSON.stringify(results[0][0]['COUNT(tagNumber)']));
                  //If initiative doesn't exist in main db, insert initiative data. Otherwise, update existing initiative
                  if (numInitiatives > 0) {
                    query12 = 'UPDATE initiative SET initiativeName = ' + sql.escape(formData.initiativeName) + ', initiativeWebsite =' + sql.escape(formData.initiativeURL) + ', targetsWomen = ' + sql.escape(formData.initiativeTargetsWomen) +
                    ', startYear =' + sql.escape(formData.initiativeStart) + ',endYear=' + sql.escape(formData.initiativeEnd) + ', description =' + sql.escape(formData.initiativeDescription) +
                    ', mainProgrammingArea = (SELECT programArea FROM programarea WHERE programArea ='  + sql.escape(formData.initiativeProgramAreas) +
                    ' AND activity = '  + sql.escape(formData.initiativeMainProgramActivity) +  ') , mainProgrammingActivity = (SELECT programmingActivity FROM programmingactivity WHERE programmingActivity = '  + sql.escape(formData.initiativeMainProgramActivity) +  '), feeToAccess = ' + sql.escape(formData.initiativeFeeAccess) +
                    ' WHERE tagNumber = '   + sql.escape(formData.tagNum)
                  } else {
                    query12 = 'INSERT into initiative VALUES (' + sql.escape(formData.tagNum) +',' + sql.escape(formData.initiativeName) + ',' + sql.escape(formData.initiativeURL) + ',' + sql.escape(formData.initiativeTargetsWomen) +
                     ',' + sql.escape(formData.initiativeStart) + ',' + sql.escape(formData.initiativeEnd) + ',' + sql.escape(formData.initiativeDescription) +
                     ',(SELECT programArea FROM programarea WHERE programArea ='  +sql.escape(formData.initiativeProgramAreas) +
                     ' AND activity = '  + sql.escape(formData.initiativeMainProgramActivity) +  '), (SELECT programmingActivity FROM programmingactivity WHERE programmingActivity = ' + sql.escape(formData.initiativeMainProgramActivity) + '),'  + sql.escape(formData.initiativeFeeAccess) +  ')'
                  }
                  async.parallel([
                      function(queryDB) {
                          pool.query(query12, {}, function(err, results) {
                              if (err){
                                  return queryDB(err)
                              }else{
                                  queryDB()
                              }
                          })
                      },
                    ], function(err) {
                        if (err){
                            console.log(err)
                        }
                    })
                  }
                })

               //delete initiative region data
               var query13= 'DELETE FROM initiativeregion WHERE tagNumber = '+ sql.escape(formData.tagNum)
               async.parallel([
                 function(queryDB) {
                     pool.query(query13, {}, function(err, results) {
                         if (err){
                             return queryDB(err)
                         }else{
                             queryDB()
                         }
                     })
                   },
                 ], function(err) {
                     if (err){
                         console.log(err)
                     } else {
                       const countryRegions = [];
                       for (var i = 0; i < formData.initiativeRegions.length; i++) {
                         for (var j = 0; j < formData.initiativeCountries.length; j++) {
                           const regionFound = countryRegions.find(region => region.region == formData.initiativeRegions[i] && region.country == formData.initiativeCountries[j]);
                           if (regionFound === undefined) {
                             countryRegions.push({region: formData.initiativeRegions[i], country: formData.initiativeCountries[j] })
                           }
                         }
                       }

                       async.map(countryRegions, function(region, queryDB) {
                           pool.query('SELECT regionName from regions WHERE regionName = ' + sql.escape(region.region) + ' AND includedCountry = ' + sql.escape(region.country), {}, function(err, results) {
                             if (err) {
                               return queryDB(err, null)
                             } else {
                               queryDB(null, results)
                             }
                           })
                         }, function(err, results) {
                           if (err) {
                             console.log(err);
                           } else {
                             let res = JSON.parse(JSON.stringify(results));
                             const regions = [];
                             res.forEach(regionListing => {
                               if (regionListing.length > 0) {
                                 regions.push(regionListing[0].regionName);
                               }
                             });
                             regionsFiltered = [...new Set(regions)];
                             //Insert region data
                             async.map(regionsFiltered, function(region, queryDB) {
                               pool.query('INSERT into initiativeregion VALUES ('+ sql.escape(formData.tagNum) +',' + sql.escape(region) + ')', {}, function(err, results) {
                                 if (err) {
                                   return queryDB(err, null)
                                 } else {
                                   queryDB(null, results)
                                 }
                               })
                             }, function(err, results) {
                               if (err) {
                                 console.log(err)
                               }
                             })
                           }
                       })
                     }
                   })

           //delete initiativecountryofoperation data
           var query15= 'DELETE FROM initiativecountryofoperation WHERE tagNumber = '+ sql.escape(formData.tagNum)
           async.parallel([
               function(queryDB) {
                   pool.query(query15, {}, function(err, results) {
                       if (err){
                           return queryDB(err)
                       }else{
                           queryDB()
                       }

                   })
                 },
               ], function(err) {
                   if (err){
                       console.log(err)
                   } else {
                     //Insert initiative country of operation data
                     for(var i = 0; i < formData.initiativeCountries.length; i++) {
                       var query16 = 'INSERT into initiativecountryofoperation VALUES ('+sql.escape(formData.tagNum) + ', (SELECT countryName from country WHERE countryName=' + sql.escape(formData.initiativeCountries[i])+ '))'
                       async.parallel([
                           function(queryDB) {
                               pool.query(query16, {}, function(err, results) {
                                   if (err){
                                       return queryDB(err)
                                   }else{
                                       queryDB()
                                   }
                               })
                           },
                       ], function(err) {
                           if (err){
                               console.log(err)
                           }
                       })
                     }
                   }
               })


           //delete initiativeprogrammingactivities data
           var query17= 'DELETE FROM initiativeprogrammingactivities WHERE tagNumber = '+ sql.escape(formData.tagNum)
           async.parallel([
               function(queryDB) {
                   pool.query(query17, {}, function(err, results) {
                       if (err){
                           return queryDB(err)
                       }else{
                           queryDB()
                       }
                   })
                 },
               ], function(err) {
                   if (err){
                       console.log(err)
                   } else {
                     //Insert initiative programming activity data
                     for(var i = 0; i < formData.initiativeActivities.length; i++) {
                       var query18 = 'INSERT into initiativeprogrammingactivities VALUES ('+sql.escape(formData.tagNum) +','+ sql.escape(formData.initiativeActivities[i])+')'
                       async.parallel([
                           function(queryDB) {
                               pool.query(query18, {}, function(err, results) {
                                   if (err){
                                       return queryDB(err)
                                   }else{
                                       queryDB()
                                   }

                               })
                           },

                       ], function(err) {
                           if (err){
                               console.log(err)
                           }
                       })
                     }
                   }
               })


             //delete initiativefundingsource data
             var query19= 'DELETE FROM initiativefundingsource WHERE tagNumber = '+ sql.escape(formData.tagNum)
             async.parallel([
                 function(queryDB) {
                     pool.query(query19, {}, function(err, results) {
                         if (err){
                             return queryDB(err)
                         }else{
                             queryDB()
                         }

                     })
                   },
                 ], function(err) {
                     if (err){
                         console.log(err)
                     } else {
                       //Insert initiative source of fees data
                       for(var i = 0; i < formData.initiativeSourceOfFees.length; i++) {
                         var query20= 'INSERT into initiativefundingsource VALUES ('+sql.escape(formData.tagNum) +','+ sql.escape(formData.initiativeSourceOfFees[i])+')'
                         async.parallel([
                             function(queryDB) {
                                 pool.query(query20, {}, function(err, results) {
                                     if (err){
                                         return queryDB(err)
                                     }else{
                                         queryDB()
                                     }
                                 })
                             },

                         ], function(err) {
                             if (err){
                                 console.log(err)
                             }
                         })
                       }
                     }
                 })


            //delete launchcountry data
            var query21= 'DELETE FROM initiativelaunchcountry WHERE tagNumber = '+ sql.escape(formData.tagNum)
            async.parallel([
                function(queryDB) {
                    pool.query(query21, {}, function(err, results) {
                        if (err){
                            return queryDB(err)
                        }else{
                            queryDB()
                        }
                    })
                },

                ], function(err) {
                    if (err){
                        console.log(err)
                    } else {
                      //Insert initiative launch country data
                      for(var i = 0; i < formData.initiativeLaunchCountry.length; i++) {
                        var query22 =  'INSERT into initiativelaunchcountry VALUES ('+sql.escape(formData.tagNum) + ',(SELECT countryName from country WHERE countryName='+ sql.escape(formData.initiativeLaunchCountry[i])+'))'
                        async.parallel([
                            function(queryDB) {
                                pool.query(query22, {}, function(err, results) {
                                    if (err){
                                        return queryDB(err)
                                    }else{
                                        queryDB()
                                    }

                                })
                            },

                        ], function(err) {
                            if (err){
                                console.log(err)
                            }

                        })
                      }
                    }
                })


            //delete initiativetargetgeography data
            var query23= 'DELETE FROM initiativetargetgeography WHERE tagNumber = '+ sql.escape(formData.tagNum)
            async.parallel([
                function(queryDB) {
                    pool.query(query23, {}, function(err, results) {
                        if (err){
                            return queryDB(err)
                        }else{
                            queryDB()
                        }
                    })
                },

                ], function(err) {
                    if (err){
                        console.log(err)
                    } else {
                      //Insert initiative target geo data
                      for(var i = 0; i < formData.initiativeTargetGeo.length; i++) {
                        var query24 = 'INSERT into initiativetargetgeography VALUES ('+sql.escape(formData.tagNum) +','+ sql.escape(formData.initiativeTargetGeo[i])+')'
                        async.parallel([
                            function(queryDB) {
                                pool.query(query24, {}, function(err, results) {
                                    if (err){
                                        return queryDB(err)
                                    }else{
                                        queryDB()
                                    }

                                })
                            },

                        ], function(err) {
                            if (err){
                                console.log(err)
                            }
                        })
                      }
                    }
                })

           //delete INSERT into initiativetargetpopulationsector data
           var query25= 'DELETE FROM initiativetargetpopulationsector WHERE tagNumber = '+ sql.escape(formData.tagNum)
           async.parallel([
               function(queryDB) {
                   pool.query(query25, {}, function(err, results) {
                       if (err){
                           return queryDB(err)
                       }else{

                           queryDB()
                       }

                   })
                 },

               ], function(err) {
                   if (err){
                       console.log(err)
                   } else {
                     //Insert initiative target population sector data
                     for(var i = 0; i < formData.initiativetargetPopulationSector.length; i++) {
                       var query26 = 'INSERT into initiativetargetpopulationsector VALUES ('+sql.escape(formData.tagNum) +','+ sql.escape(formData.initiativetargetPopulationSector[i])+')'
                       async.parallel([
                           function(queryDB) {
                               pool.query(query26, {}, function(err, results) {
                                   if (err){
                                       return queryDB(err)
                                   }else{
                                       queryDB()
                                   }

                               })
                           },

                       ], function(err) {
                           if (err){
                               console.log(err)
                           }
                         })
                     }
                   }
               })


           //delete initiativemonitoredoutcomes data
           var query27= 'DELETE FROM initiativemonitoredoutcomes WHERE tagNumber = '+ sql.escape(formData.tagNum)
           async.parallel([
               function(queryDB) {
                   pool.query(query27, {}, function(err, results) {
                       if (err){
                           return queryDB(err)
                       }else{

                           queryDB()
                       }

                   })
               },

               ], function(err) {
                   if (err){
                       console.log(err)
                   } else {
                     //Insert initiative outcomes monitored data
                     for(var i = 0; i < formData.initiativeOutcomesMonitored.length; i++) {
                       var query28 = 'INSERT into initiativemonitoredoutcomes VALUES ('+sql.escape(formData.tagNum) +','+ sql.escape(formData.initiativeOutcomesMonitored[i])+')'
                       async.parallel([
                           function(queryDB) {
                               pool.query(query28, {}, function(err, results) {
                                   if (err){
                                       return queryDB(err)
                                   }else{
                                       queryDB()
                                   }
                               })
                           },
                       ], function(err) {
                           if (err){
                               console.log(err)
                           }
                       })
                     }
                 }
           })


           //delete initiative main education subsector data
           var query29= 'DELETE FROM initiativemaineducationsubsector WHERE tagNumber = '+ sql.escape(formData.tagNum)
           async.parallel([
             function(queryDB) {
                 pool.query(query29, {}, function(err, results) {
                     if (err){
                         return queryDB(err)
                     }else{
                         queryDB()
                     }
                 })
               },
             ], function(err) {
                 if (err){
                     console.log(err)
                 } else {
                   //Insert initiative main education subsector data
                   for(var i = 0; i < formData.initiativeMEdSubs.length; i++) {
                     var query30 = 'INSERT into initiativemaineducationsubsector VALUES ('+sql.escape(formData.tagNum) + ',(SELECT educationSubsector FROM educationsubsector WHERE educationSubsector =' + sql.escape(formData.initiativeMEdSubs[i])+'))'
                     async.parallel([
                         function(queryDB) {
                             pool.query(query30, {}, function(err, results) {
                                 if (err){
                                     return queryDB(err)
                                 }else{
                                     queryDB()
                                 }
                             })
                         },

                     ], function(err) {
                         if (err){
                             console.log(err)
                         }

                     })
                   }
                 }
           })


           //delete initiativeeducationsubsectors data
           var query31= 'DELETE FROM initiativeeducationsubsectors WHERE initiativeTagNumber = '+ sql.escape(formData.tagNum)
           async.parallel([
               function(queryDB) {
                   pool.query(query31, {}, function(err, results) {
                       if (err){
                           return queryDB(err)
                       }else{

                           queryDB()
                       }

                   })
                 },
               ], function(err) {
                   if (err){
                       console.log(err)
                   } else {
                     //Insert initiative education subsector data
                     for(var i = 0; i < formData.initiativeOEdSubs.length; i++) {
                       var query32 = 'INSERT into initiativeeducationsubsectors VALUES ('+sql.escape(formData.tagNum) + ',(SELECT educationSubsector FROM educationsubsector WHERE educationSubsector =' + sql.escape(formData.initiativeOEdSubs[i])+ '))'
                       async.parallel([
                           function(queryDB) {
                               pool.query(query32, {}, function(err, results) {
                                   if (err){
                                       return queryDB(err)
                                   }else{
                                       queryDB()
                                   }
                               })
                           },

                       ], function(err) {
                           if (err){
                               console.log(err)
                           }
                       })
                     }
                 }
           })


           //delete initiativetargetschoolmanagement data
           var query33= 'DELETE FROM initiativetargetschoolmanagement WHERE tagNumber = '+ sql.escape(formData.tagNum)
           async.parallel([
               function(queryDB) {
                   pool.query(query33, {}, function(err, results) {
                       if (err){
                           return queryDB(err)
                       }else{
                           queryDB()
                       }
                   })
                 },
               ], function(err) {
                   if (err){
                       console.log(err)
                   } else {
                     //Insert initiative target management data
                     for(var i = 0; i < formData.initiativeManagementTypes.length; i++) {
                       var query34 = 'INSERT into initiativetargetschoolmanagement VALUES ('+sql.escape(formData.tagNum) +','+ sql.escape(formData.initiativeManagementTypes[i])+')'
                       async.parallel([
                           function(queryDB) {
                               pool.query(query34, {}, function(err, results) {
                                   if (err){
                                       return queryDB(err)
                                   }else{
                                       queryDB()
                                   }
                               })
                           },

                       ], function(err) {
                           if (err){
                               console.log(err)
                           }
                       })
                     }
                   }

               })

           //Count number of initiatives this funder funds
           async.parallel([
             function(queryDB) {
                 pool.query(queryNumFunders, {}, function(err, results) {
                     if (err){
                         return queryDB(err)
                     }else{
                         queryDB()
                     }
                 })
             },
           ], function(err) {
               if (err){
                   console.log(err)
               } else {
                 numFunders = JSON.parse(JSON.stringify(results[0][0]['COUNT(funderName)']));
                 // funder - funds - relationship
                 //If funder already existed in temp but not yet in main
                 var query36;
                 if (numFunderInitiatives == 0) {
                   if (numFunders == 0) {
                     query36 = 'INSERT into funds VALUES (' + sql.escape(formData.tagNum) + ',' + sql.escape(formData.funderName) +  ','  + sql.escape(formData.initiativeStart) +  ','  + sql.escape(formData.initiativeEnd) +  ')'
                   } else {
                     query36 = 'UPDATE funds SET funderName = (SELECT funderName FROM funder WHERE funderName ='
                     + sql.escape(formData.funderName) +  '), startYear = ' + sql.escape(formData.initiativeStart) +  ', endYear ='  + sql.escape(formData.initiativeEnd) + ' WHERE (tagNum ='  + sql.escape(formData.tagNum) + ')'
                   }
                 } else {
                   query36 = 'UPDATE funds SET funderName = (SELECT funderName FROM funder WHERE funderName ='
                   + sql.escape(formData.funderName)+ '), startYear = '+sql.escape(formData.initiativeStart) + ', endYear =' + sql.escape(formData.initiativeEnd) +' WHERE (tagNum =' + sql.escape(formData.tagNum) + ') AND (funderName = '
                   + sql.escape(formData.OfunderName) +')'
                 }

                 async.parallel([
                     function(queryDB) {
                         pool.query(query36, {}, function(err, results) {
                             if (err){
                                 return queryDB(err)
                             }else{
                                 queryDB()
                             }

                         })
                       },
                     ], function(err) {
                         if (err){
                             console.log(err)
                         }
                     })
                   }
               })
         }
     })

     ///////////////////////////////Update implements and implementor tables
     var numImplementerInitiatives;  //Number of initiatives implemented by implementer
     var numImplementers;  //Number of implementers with the current tagNum associated to them
     var queryNumImplementerInitiatives = 'SELECT COUNT(implementorName) FROM implements WHERE implementorName = ' + sql.escape(formData.OimplementorName) //Get number of initiatives funded by funder
     var queryNumImplementers = 'SELECT COUNT(implementorName) FROM implements WHERE tagNum = ' + sql.escape(formData.tagNum)

     var query41;
     async.parallel([
      function(queryDB) {
          pool.query(queryNumImplementerInitiatives, {}, function(err, results) {
              if (err){
                  return queryDB(err, null)
              }else{
                  queryDB(null, results)
              }
          })
      },

    ], function(err, results) {
          if (err){
            console.log(err)
          } else {
              numImplementerInitiatives = JSON.parse(JSON.stringify(results[0][0]['COUNT(implementorName)']));
              //If implementer existed in main already but hasnt been added to temp db yet
              if (numImplementerInitiatives == 0) {
                query41 = 'INSERT into implementor VALUES (' + sql.escape(formData.implementorName) + ',' + sql.escape(formData.implementorMotive) + ')'
              } else {
                if (numImplementerInitiatives > 1 && formData.implementorName !== formData.OimplementorName) {
                  query41 = 'INSERT into implementor VALUES (' + sql.escape(formData.implementorName) + ',' + sql.escape(formData.implementorMotive) + ')'
                }
                else {
                  query41 = 'UPDATE implementor SET implementorName =' + sql.escape(formData.implementorName) + ', profitMotive =' + sql.escape(formData.implementorMotive)+' WHERE implementorName = '+ sql.escape(formData.OimplementorName)
                }
              }

              async.parallel([
               function(queryDB) {
                   pool.query(query41, {}, function(err, results) {
                       if (err){
                           return queryDB(err)
                       }else{
                           queryDB()
                       }
                   })
                 },
               ], function(err) {
                   if (err){
                       console.log(err)
                   }
               })

               async.parallel([
                 function(queryDB) {
                     pool.query(queryNumImplementers, {}, function(err, results) {
                         if (err){
                             return queryDB(err)
                         }else{
                             queryDB()
                         }
                     })
                 },
               ], function(err) {
                   if (err){
                       console.log(err)
                   } else {
                     numImplementers = JSON.parse(JSON.stringify(results[0][0]['COUNT(implementorName)']));
                     //implementor - implements - initiative
                     //If implementer already existed in main but not yet in temp
                     var query42;
                     if (numImplementerInitiatives == 0) {
                       if (numImplementers == 0) {
                         query42 = 'INSERT into implements VALUES (' + sql.escape(formData.tagNum) + ',' + sql.escape(formData.implementorName) + ',' + sql.escape(formData.initiativeStart) + ',' + sql.escape(formData.initiativeEnd) + ')'
                       } else {
                         query42 = 'UPDATE implements SET implementorName = (SELECT implementorName from implementor WHERE implementorName ='+ sql.escape(formData.implementorName) + ') WHERE (tagNum =' + sql.escape(formData.tagNum) + ')'
                       }
                     } else {
                       query42 = 'UPDATE implements SET implementorName = (SELECT implementorName from implementor WHERE implementorName =' + sql.escape(formData.implementorName) + ') WHERE (tagNum =' + sql.escape(formData.tagNum) + ') AND (implementorName = ' + sql.escape(formData.OimplementorName) + ')'
                     }

                     async.parallel([
                       function(queryDB) {
                           pool.query(query42, {}, function(err, results) {
                               if (err){
                                   return queryDB(err)
                               }else{
                                   queryDB()
                               }
                           })
                         },
                       ], function(err) {
                           if (err){
                               console.log(err)
                           }
                       })
                   }
             })
         }
    })

    res.send("Inves431_girlsEd updated successfully!")
  } else {
    res.json({"error": "Error: Action not authorized"})
  }
})

dashboard.post('/update-form-temp', (req, res) =>{
  if (req.user){
    const formData = {
        //original values
        tagNum: req.body.tagNum,
        OfunderName: req.body.ofname,
        OimplementorName: req.body.oiname,
        // single val funder
        funderName: req.body.fname, //f
        funderUrl: req.body.furl, //f
        funderMotive: req.body.motive, //f
        funderImpact: req.body.impact, //f
        funderOrganizationForm: req.body.organizationForm, //f
        // multi val funder
        funderInternationalBases: req.body.internationalBases, //f
        funderEducationSubsector: req.body.edSubs, //f
        funderOrgTraits: req.body.orgTraits, //f
        funderAsiaBases: req.body.asialBases, //f
        funderAsiaOperations: req.body.asiaOperations, //f
        // single val initiative
        initiativeName: req.body.initName, //in
        initiativeURL: req.body.initURL, //in
        initiativeTargetsWomen: req.body.tWomen, //in
        initiativeStart: req.body.initStart, //in
        initiativeEnd: req.body.initEnd, //in
        initiativeDescription: req.body.idescription, //in
        initiativeProgramAreas: req.body.programArea, //in
        initiativeMainProgramActivity: req.body.initativeMainProgramActivity, //in
        initiativeFeeAccess: req.body.feeAccess, //in
        // multi val initiative
        initiativeRegions: req.body.regions, //in
        initiativeCountries: req.body.countries, //in
        initiativeActivities: req.body.activities, //in
        initiativeSourceOfFees: req.body.sourceOfFees, //in
        initiativeLaunchCountry: req.body.launchCountry, //in
        initiativeTargetGeo: req.body.targetGeos, //in
        initiativetargetPopulationSector: req.body.targetPopulationSectors, //in
        initiativeOutcomesMonitored: req.body.outcomesMonitored, //in
        initiativeMEdSubs: req.body.mEdSubs, //in
        initiativeOEdSubs: req.body.oEdSubs, //in
        initiativeManagementTypes: req.body.managementTypes, //in
        // single val implementer
        implementorName: req.body.iname, //im
        implementorMotive: req.body.impMotive, //im

        // single val other
        comments: req.body.comments, //other
        needsReview: req.body.needsReview, //other
        inDB: req.body.inDB,

        //section Reviews
        funderNameApproval: req.body.fnameA,
        funderUrlApproval: req.body.furlA,
        funderMotiveApproval: req.body.motiveA,
        funderImpactApproval: req.body.impactA,
        funderOrganizationFormApproval: req.body.organizationFormA,
        funderInternationalBaseApproval: req.body.internationalBasesA,
        funderEdSubsApproval: req.body.edSubsA,
        funderOrgTraitsApproval: req.body.orgTraitsA,
        funderAsiaBasesApproval: req.body.asialBasesA,
        funderAsiaOperationsApproval: req.body.asiaOperationsA,
        initNameApproval:req.body.initNameA,
        initUrlApproval: req.body.initURLA,
        initTargetsWomenApproval: req.body.tWomenA,
        initStartApproval: req.body.initStartA,
        initEndApproval: req.body.initEndA,
        initDescriptionApproval: req.body.idescriptionA,
        initProgramAreasApproval: req.body.programAreaA,
        initMainProgramActivityApproval: req.body.initiativeMainProgramActivityA,
        initFeeAccessApproval: req.body.feeAccessA,
        initRegionsApproval: req.body.regionsA,
        initCountriesApproval: req.body.countriesA,
        initActivitiesApproval:  req.body.activitiesA,
        initSourceOfFeesApproval: req.body.sourceOfFeesA,
        initLaunchCountryApproval: req.body.launchCountryA,
        initTargetGeoApproval: req.body.targetGeosA,
        initTargetPopulationSectorApproval: req.body.targetPopulationSectorsA,
        initOutcomesMonitoredApproval: req.body.outcomesMonitoredA,
        initMEdSubsApproval: req.body.mEdSubsA,
        initOEdSubsApproval:  req.body.oEdSubsA,
        initManagementTypesApproval: req.body.managementTypesA,
        implementorNameApproval: req.body.inameA,
        implementorMotiveApproval: req.body.impMotiveA
    }

   //Update funder data or insert new funder if funder funds other initiatives - if this is the case, don't want to replace(update) the funder
   var query1;
   var numFunderInitiatives;  //Number of initiatives funded by funder
   var numFunders //Number of funders by specified tag number
   var queryNumFunderInitiatives = 'SELECT COUNT(funderName) FROM funds WHERE funderName = ' + sql.escape(formData.OfunderName)  //Get number of initiatives funded by funder
   var queryNumFunders = 'SELECT COUNT(funderName) FROM funds WHERE tagNum = ' + sql.escape(formData.tagNum)  //Get number of funders specified by tag number

   async.parallel([
    function(queryDB) {
        poolTemp.query(queryNumFunderInitiatives, {}, function(err, results) {
            if (err){
                return queryDB(err, null)
            }else{
                queryDB(null, results)
            }

        })
    },

  ], function(err, results) {
        if (err){
          res.json(err)
        } else {
          numFunderInitiatives = JSON.parse(JSON.stringify(results[0][0]['COUNT(funderName)']));

          //If funder existed in main already when previously added by an RA, and doesn't exist in temp db
          if (numFunderInitiatives == 0) {
            query1 = 'INSERT into funder VALUES (' + sql.escape(formData.funderName) + ',' + sql.escape(formData.funderUrl) + ',' + sql.escape(formData.funderMotive) + ',' + sql.escape(formData.funderImpact) + ',' + sql.escape(formData.funderOrganizationForm) + ')'
          } else {
            if (numFunderInitiatives > 1 && formData.funderName !== formData.OfunderName) {
              query1 = 'INSERT into funder VALUES (' + sql.escape(formData.funderName) + ',' + sql.escape(formData.funderUrl) + ',' + sql.escape(formData.funderMotive) + ',' + sql.escape(formData.funderImpact) + ',' + sql.escape(formData.funderOrganizationForm) + ')'
            }
            else {
              query1 = 'UPDATE funder SET funderName = ' + sql.escape(formData.funderName) + ', funderWebsite ='+ sql.escape(formData.funderUrl) +', profitMotive =' + sql.escape(formData.funderMotive) +', impactInvesting ='+ sql.escape(formData.funderImpact)
             +', organizationalForm ='+ sql.escape(formData.funderOrganizationForm) +' WHERE funderName = ' + sql.escape(formData.OfunderName)
           }
          }

          async.parallel([
           function(queryDB) {
               poolTemp.query(query1, {}, function(err, results) {
                   if (err){
                       return queryDB(err)
                   }else{
                       queryDB()
                   }
               })
           },

           ], function(err) {
               if (err){
                   console.log(err)
               }
           })

           if (numFunderInitiatives <= 1 || formData.funderName == formData.OfunderName) {
             //delete all funder international base
             var query2 = 'DELETE FROM funderinternationalbases WHERE funderName = ' + sql.escape(formData.OfunderName)
             async.parallel([
                 function(queryDB) {
                     poolTemp.query(query2, {}, function(err, results) {
                         if (err){
                             return queryDB(err)
                         }else{
                             queryDB()
                         }
                     })
                 },

                 ], function(err) {
                     if (err){
                         console.log(err)
                     } else {
                       //Insert funder international bases data
                       for(var i = 0; i <formData.funderInternationalBases.length; i++) {
                          var query3 = 'INSERT into funderinternationalbases VALUES (' + sql.escape(formData.funderName) + ',' + sql.escape(formData.funderInternationalBases[i]) + ')'
                          //console.log(query2)
                          async.parallel([
                              function(queryDB) {
                                  poolTemp.query(query3, {}, function(err, results) {
                                      if (err){
                                          return queryDB(err)
                                      }else{
                                          //formData.table1 = results;
                                          queryDB()
                                      }
                                  })
                              },

                          ], function(err) {
                              if (err){
                                  console.log(err)
                              }
                          })
                        }
                     }
               })
           } else {
             //Insert funder international bases data
             for(var i = 0; i <formData.funderInternationalBases.length; i++) {
                var query3 = 'INSERT into funderinternationalbases VALUES (' + sql.escape(formData.funderName) + ',' + sql.escape(formData.funderInternationalBases[i]) + ')'
                //console.log(query2)
                async.parallel([
                    function(queryDB) {
                        poolTemp.query(query3, {}, function(err, results) {
                            if (err){
                                return queryDB(err)
                            }else{
                                //formData.table1 = results;
                                queryDB()
                            }

                        })
                    },

                ], function(err) {
                    if (err){
                        console.log(err)
                    }
                })
              }
           }

           //delete all funder fundereducationsubsectors
           if (numFunderInitiatives <= 1 || formData.funderName == formData.OfunderName) {
             var query4 = 'DELETE FROM fundereducationsubsectors WHERE funderName = ' + sql.escape(formData.OfunderName)
             async.parallel([
                 function(queryDB) {
                     poolTemp.query(query4, {}, function(err, results) {
                         if (err){
                             return queryDB(err)
                         }else{
                             queryDB()
                         }
                     })
                 },

                 ], function(err) {
                     if (err){
                         console.log(err)
                     } else {
                       //Insert funder education subsector data
                       for(var i = 0; i <formData.funderEducationSubsector.length; i++) {
                         var query5 = 'INSERT into fundereducationsubsectors VALUES (' + sql.escape(formData.funderName) + ',' + sql.escape(formData.funderEducationSubsector[i]) + ')'
                         async.parallel([
                             function(queryDB) {
                                 poolTemp.query(query5, {}, function(err, results) {
                                     if (err){
                                         return queryDB(err)
                                     }else{
                                         //formData.table1 = results;
                                         queryDB()
                                     }
                                 })
                             },
                         ], function(err) {
                             if (err){
                                 console.log(err)
                             }
                           })
                       }
                     }

                 })
             } else {
               //Insert funder education subsector data
               for(var i = 0; i <formData.funderEducationSubsector.length; i++) {
                 var query5 = 'INSERT into fundereducationsubsectors VALUES (' + sql.escape(formData.funderName) + ',' + sql.escape(formData.funderEducationSubsector[i]) + ')'
                 async.parallel([
                     function(queryDB) {
                         poolTemp.query(query5, {}, function(err, results) {
                             if (err){
                                 return queryDB(err)
                             }else{
                                 //formData.table1 = results;
                                 queryDB()
                             }
                         })
                     },

                 ], function(err) {
                     if (err){
                         console.log(err)
                     }
                   })
               }
             }


           if (numFunderInitiatives <= 1 || formData.funderName == formData.OfunderName) {
             //delete all funder funderorganizationtraits
             var query6 = 'DELETE FROM funderorganizationtraits WHERE funderName = ' + sql.escape(formData.OfunderName)
             async.parallel([
                 function(queryDB) {
                     poolTemp.query(query6, {}, function(err, results) {
                         if (err){
                             return queryDB(err)
                         }else{
                             queryDB()
                         }

                     })
                 },

                 ], function(err) {
                     if (err){
                         console.log(err)
                     } else {
                       //Insert funder education organizational traits data
                       for(var i = 0; i <formData.funderOrgTraits.length; i++) {
                         var query7 = 'INSERT into funderorganizationtraits VALUES (' + sql.escape(formData.funderName) + ',' + sql.escape(formData.funderOrgTraits[i]) + ')'
                         async.parallel([
                             function(queryDB) {
                                 poolTemp.query(query7, {}, function(err, results) {
                                     if (err){
                                         return queryDB(err)
                                     }else{
                                         //formData.table1 = results;
                                         queryDB()
                                     }
                                 })
                             },

                         ], function(err) {
                             if (err){
                                 console.log(err)
                             }
                         })
                       }
                     }
                 })
           } else {
             //Insert funder education organizational traits data
             for(var i = 0; i <formData.funderOrgTraits.length; i++) {
               var query7 = 'INSERT into funderorganizationtraits VALUES (' + sql.escape(formData.funderName) + ',' + sql.escape(formData.funderOrgTraits[i]) + ')'
               async.parallel([
                   function(queryDB) {
                       poolTemp.query(query7, {}, function(err, results) {
                           if (err){
                               return queryDB(err)
                           }else{
                               //formData.table1 = results;
                               queryDB()
                           }

                       })
                   },

               ], function(err) {
                   if (err){
                       console.log(err)
                   }

               })
             }
           }


           if (numFunderInitiatives <= 1 || formData.funderName == formData.OfunderName) {
             //delete all funder asiabases
             var query8 = 'DELETE FROM funderasiabases WHERE funderName = ' + sql.escape(formData.OfunderName)
             async.parallel([
                 function(queryDB) {
                     poolTemp.query(query8, {}, function(err, results) {
                         if (err){
                             return queryDB(err)
                         }else{
                             queryDB()
                         }

                     })
                 },

                 ], function(err) {
                     if (err){
                         console.log(err)
                     } else {
                       //Insert funder asia bases data
                       for(var i = 0; i <formData.funderAsiaBases.length; i++) {
                         var query9 = 'INSERT into funderasiabases VALUES (' + sql.escape(formData.funderName) + ',' + sql.escape(formData.funderAsiaBases[i])+ ')'
                         async.parallel([
                             function(queryDB) {
                                 poolTemp.query(query9, {}, function(err, results) {
                                     if (err){
                                         return queryDB(err)
                                     }else{
                                         //formData.table1 = results;
                                         queryDB()
                                     }

                                 })
                             },

                         ], function(err) {
                             if (err){
                                 console.log(err)
                             }

                         })
                       }
                     }
                 })
           } else {
             //Insert funder asia bases data
             for(var i = 0; i <formData.funderAsiaBases.length; i++) {
               var query9 = 'INSERT into funderasiabases VALUES ('  + sql.escape(formData.funderName) + ',' + sql.escape(formData.funderAsiaBases[i])+ ')'
               async.parallel([
                   function(queryDB) {
                       poolTemp.query(query9, {}, function(err, results) {
                           if (err){
                               return queryDB(err)
                           }else{
                               //formData.table1 = results;
                               queryDB()
                           }
                       })
                   },

               ], function(err) {
                   if (err){
                       console.log(err)
                   }

               })
             }
           }

           if (numFunderInitiatives <= 1 || formData.funderName == formData.OfunderName) {
             //delete all funder asia operations
             var query10= 'DELETE FROM funderasiaoperations WHERE funderName = ' + sql.escape(formData.OfunderName)
             async.parallel([
                 function(queryDB) {
                     poolTemp.query(query10, {}, function(err, results) {
                         if (err){
                             return queryDB(err)
                         }else{

                             queryDB()
                         }

                     })
                 },

                 ], function(err) {
                     if (err){
                         console.log(err)
                     } else {
                       //Insert funder education funder asia operations data
                       for(var i = 0; i < formData.funderAsiaOperations.length; i++) {
                         var query11 = 'INSERT into funderasiaoperations VALUES (' + sql.escape(formData.funderName) + ',' + sql.escape(formData.funderAsiaOperations[i])+ ')'
                         async.parallel([
                             function(queryDB) {
                                 poolTemp.query(query11, {}, function(err, results) {
                                     if (err){
                                         return queryDB(err)
                                     }else{
                                         //sql.escape(formData.table1 = results;
                                         queryDB()
                                     }

                                 })
                             },

                         ], function(err) {
                             if (err){
                                 console.log(err)
                             }

                         })
                       }
                     }
                 })
           } else {
             //Insert funder education funder asia operations data
             for(var i = 0; i < formData.funderAsiaOperations.length; i++) {
               var query11 = 'INSERT into funderasiaoperations VALUES (' + sql.escape(formData.funderName) + ',' + sql.escape(formData.funderAsiaOperations[i])+ ')'
               async.parallel([
                   function(queryDB) {
                       poolTemp.query(query11, {}, function(err, results) {
                           if (err){
                               return queryDB(err)
                           }else{
                               //formData.table1 = results;
                               queryDB()
                           }
                       })
                   },

               ], function(err) {
                   if (err){
                       console.log(err)
                   }
               })
             }
           }


           var query12;
           var queryNumInitiatives = 'SELECT COUNT(tagNumber) FROM initiative WHERE tagNumber = ' + sql.escape(formData.tagNum)  //Check if initiative exists in main db
           async.parallel([
             function(queryDB) {
                 poolTemp.query(queryNumInitiatives, {}, function(err, results) {
                     if (err){
                         return queryDB(err, null)
                     }else{
                         queryDB(null, results)
                     }
                 })
             }
           ], function(err, results) {
               if (err){
                   console.log(err)
               } else {
                 let numInitiatives = JSON.parse(JSON.stringify(results[0][0]['COUNT(tagNumber)']));
                 //If initiative doesn't exist in main db, insert initiative data. Otherwise, update existing initiative
                 if (numInitiatives > 0) {
                   query12 = 'UPDATE initiative SET initiativeName = '  + sql.escape(formData.initiativeName) + ', initiativeWebsite =' + sql.escape(formData.initiativeURL) + ', targetsWomen = ' + sql.escape(formData.initiativeTargetsWomen) +
                    ', startYear =' + sql.escape(formData.initiativeStart) + ',endYear=' + sql.escape(formData.initiativeEnd) + ', description =' + sql.escape(formData.initiativeDescription) +
                    ', mainProgrammingArea = (SELECT programArea FROM programarea WHERE programArea ='  + sql.escape(formData.initiativeProgramAreas)
                   +  ' AND activity = '  + sql.escape(formData.initiativeMainProgramActivity) +  ') , mainProgrammingActivity = (SELECT programmingActivity FROM programmingactivity WHERE programmingActivity = '  + sql.escape(formData.initiativeMainProgramActivity) +  '), feeToAccess = ' + sql.escape(formData.initiativeFeeAccess)
                   +  ' WHERE tagNumber = '   + sql.escape(formData.tagNum)
                 } else {
                   query12 = 'INSERT into initiative VALUES (' + sql.escape(formData.tagNum) +',' + sql.escape(formData.initiativeName) + ',' + sql.escape(formData.initiativeURL) + ',' + sql.escape(formData.initiativeTargetsWomen) +
                    ',' + sql.escape(formData.initiativeStart) + ',' + sql.escape(formData.initiativeEnd) + ',' + sql.escape(formData.initiativeDescription) +
                    ',(SELECT programArea FROM programarea WHERE programArea ='  +sql.escape(formData.initiativeProgramAreas) +
                    ' AND activity = '  + sql.escape(formData.initiativeMainProgramActivity) +  '), (SELECT programmingActivity FROM programmingactivity WHERE programmingActivity = ' + sql.escape(formData.initiativeMainProgramActivity) + '),'  + sql.escape(formData.initiativeFeeAccess) +  ')'
                 }
                 async.parallel([
                     function(queryDB) {
                         poolTemp.query(query12, {}, function(err, results) {
                             if (err){
                                 return queryDB(err)
                             }else{
                                 queryDB()
                             }
                         })
                     },
                   ], function(err) {
                       if (err){
                           console.log(err)
                       }
                   })
                 }
               })

              //delete initiative region data
              var query13= 'DELETE FROM initiativeregion WHERE tagNumber = '+ sql.escape(formData.tagNum)
              async.parallel([
                function(queryDB) {
                    poolTemp.query(query13, {}, function(err, results) {
                        if (err){
                            return queryDB(err)
                        }else{
                            queryDB()
                        }
                    })
                  },
                ], function(err) {
                    if (err){
                        console.log(err)
                    } else {
                      const countryRegions = [];
                      for (var i = 0; i < formData.initiativeRegions.length; i++) {
                        for (var j = 0; j < formData.initiativeCountries.length; j++) {
                          const regionFound = countryRegions.find(region => region.region == formData.initiativeRegions[i] && region.country == formData.initiativeCountries[j]);
                          if (regionFound === undefined) {
                            countryRegions.push({region: formData.initiativeRegions[i], country: formData.initiativeCountries[j] })
                          }
                        }
                      }

                      async.map(countryRegions, function(region, queryDB) {
                          poolTemp.query('SELECT regionName from regions WHERE regionName = ' + sql.escape(region.region) + ' AND includedCountry = ' + sql.escape(region.country), {}, function(err, results) {
                            if (err) {
                              return queryDB(err, null)
                            } else {
                              queryDB(null, results)
                            }
                          })
                        }, function(err, results) {
                          if (err) {
                            console.log(err);
                          } else {
                            let res = JSON.parse(JSON.stringify(results));
                            const regions = [];
                            res.forEach(regionListing => {
                              if (regionListing.length > 0) {
                                regions.push(regionListing[0].regionName);
                              }
                            });
                            regionsFiltered = [...new Set(regions)];
                            //Insert region data
                            async.map(regionsFiltered, function(region, queryDB) {
                              poolTemp.query('INSERT into initiativeregion VALUES ('+ sql.escape(formData.tagNum) +',' + sql.escape(region) + ')', {}, function(err, results) {
                                if (err) {
                                  return queryDB(err, null)
                                } else {
                                  queryDB(null, results)
                                }
                              })
                            }, function(err, results) {
                              if (err) {
                                console.log(err)
                              }
                            })
                          }
                      })
                    }
                  })

          //delete initiativecountryofoperation data
          var query15= 'DELETE FROM initiativecountryofoperation WHERE tagNumber = '+ sql.escape(formData.tagNum)
          async.parallel([
              function(queryDB) {
                  poolTemp.query(query15, {}, function(err, results) {
                      if (err){
                          return queryDB(err)
                      }else{
                          queryDB()
                      }

                  })
                },
              ], function(err) {
                  if (err){
                      console.log(err)
                  } else {
                    //Insert initiative country of operation data
                    for(var i = 0; i < formData.initiativeCountries.length; i++) {
                      var query16 = 'INSERT into initiativecountryofoperation VALUES ('+sql.escape(formData.tagNum) + ', (SELECT countryName from country WHERE countryName=' + sql.escape(formData.initiativeCountries[i])+ '))'
                      async.parallel([
                          function(queryDB) {
                              poolTemp.query(query16, {}, function(err, results) {
                                  if (err){
                                      return queryDB(err)
                                  }else{
                                      queryDB()
                                  }
                              })
                          },
                      ], function(err) {
                          if (err){
                              console.log(err)
                          }
                      })
                    }
                  }
              })


          //delete initiativeprogrammingactivities data
          var query17= 'DELETE FROM initiativeprogrammingactivities WHERE tagNumber = '+ sql.escape(formData.tagNum)
          async.parallel([
              function(queryDB) {
                  poolTemp.query(query17, {}, function(err, results) {
                      if (err){
                          return queryDB(err)
                      }else{
                          queryDB()
                      }
                  })
                },
              ], function(err) {
                  if (err){
                      console.log(err)
                  } else {
                    //Insert initiative programming activity data
                    for(var i = 0; i < formData.initiativeActivities.length; i++) {
                      var query18 = 'INSERT into initiativeprogrammingactivities VALUES ('+sql.escape(formData.tagNum) +','+ sql.escape(formData.initiativeActivities[i])+')'
                      async.parallel([
                          function(queryDB) {
                              poolTemp.query(query18, {}, function(err, results) {
                                  if (err){
                                      return queryDB(err)
                                  }else{
                                      queryDB()
                                  }

                              })
                          },

                      ], function(err) {
                          if (err){
                              console.log(err)
                          }
                      })
                    }
                  }
              })


            //delete initiativefundingsource data
            var query19= 'DELETE FROM initiativefundingsource WHERE tagNumber = '+ sql.escape(formData.tagNum)
            async.parallel([
                function(queryDB) {
                    poolTemp.query(query19, {}, function(err, results) {
                        if (err){
                            return queryDB(err)
                        }else{
                            queryDB()
                        }

                    })
                  },
                ], function(err) {
                    if (err){
                        console.log(err)
                    } else {
                      //Insert initiative source of fees data
                      for(var i = 0; i < formData.initiativeSourceOfFees.length; i++) {
                        var query20= 'INSERT into initiativefundingsource VALUES ('+sql.escape(formData.tagNum) +','+ sql.escape(formData.initiativeSourceOfFees[i])+')'
                        async.parallel([
                            function(queryDB) {
                                poolTemp.query(query20, {}, function(err, results) {
                                    if (err){
                                        return queryDB(err)
                                    }else{
                                        queryDB()
                                    }
                                })
                            },

                        ], function(err) {
                            if (err){
                                console.log(err)
                            }
                        })
                      }
                    }
                })


           //delete launchcountry data
           var query21= 'DELETE FROM initiativelaunchcountry WHERE tagNumber = '+ sql.escape(formData.tagNum)
           async.parallel([
               function(queryDB) {
                   poolTemp.query(query21, {}, function(err, results) {
                       if (err){
                           return queryDB(err)
                       }else{
                           queryDB()
                       }
                   })
               },

               ], function(err) {
                   if (err){
                       console.log(err)
                   } else {
                     //Insert initiative launch country data
                     for(var i = 0; i < formData.initiativeLaunchCountry.length; i++) {
                       var query22 =  'INSERT into initiativelaunchcountry VALUES ('+sql.escape(formData.tagNum) + ',(SELECT countryName from country WHERE countryName='+ sql.escape(formData.initiativeLaunchCountry[i])+'))'
                       async.parallel([
                           function(queryDB) {
                               poolTemp.query(query22, {}, function(err, results) {
                                   if (err){
                                       return queryDB(err)
                                   }else{
                                       queryDB()
                                   }

                               })
                           },

                       ], function(err) {
                           if (err){
                               console.log(err)
                           }

                       })
                     }
                   }
               })


           //delete initiativetargetgeography data
           var query23= 'DELETE FROM initiativetargetgeography WHERE tagNumber = '+ sql.escape(formData.tagNum)
           async.parallel([
               function(queryDB) {
                   poolTemp.query(query23, {}, function(err, results) {
                       if (err){
                           return queryDB(err)
                       }else{
                           queryDB()
                       }
                   })
               },

               ], function(err) {
                   if (err){
                       console.log(err)
                   } else {
                     //Insert initiative target geo data
                     for(var i = 0; i < formData.initiativeTargetGeo.length; i++) {
                       var query24 = 'INSERT into initiativetargetgeography VALUES ('+sql.escape(formData.tagNum) +','+ sql.escape(formData.initiativeTargetGeo[i])+')'
                       async.parallel([
                           function(queryDB) {
                               poolTemp.query(query24, {}, function(err, results) {
                                   if (err){
                                       return queryDB(err)
                                   }else{
                                       queryDB()
                                   }

                               })
                           },

                       ], function(err) {
                           if (err){
                               console.log(err)
                           }
                       })
                     }
                   }
               })

          //delete INSERT into initiativetargetpopulationsector data
          var query25= 'DELETE FROM initiativetargetpopulationsector WHERE tagNumber = '+ sql.escape(formData.tagNum)
          async.parallel([
              function(queryDB) {
                  poolTemp.query(query25, {}, function(err, results) {
                      if (err){
                          return queryDB(err)
                      }else{

                          queryDB()
                      }

                  })
                },

              ], function(err) {
                  if (err){
                      console.log(err)
                  } else {
                    //Insert initiative target population sector data
                    for(var i = 0; i < formData.initiativetargetPopulationSector.length; i++) {
                      var query26 = 'INSERT into initiativetargetpopulationsector VALUES ('+sql.escape(formData.tagNum) +','+ sql.escape(formData.initiativetargetPopulationSector[i])+')'
                      async.parallel([
                          function(queryDB) {
                              poolTemp.query(query26, {}, function(err, results) {
                                  if (err){
                                      return queryDB(err)
                                  }else{
                                      queryDB()
                                  }

                              })
                          },

                      ], function(err) {
                          if (err){
                              console.log(err)
                          }
                        })
                    }
                  }
              })


          //delete initiativemonitoredoutcomes data
          var query27= 'DELETE FROM initiativemonitoredoutcomes WHERE tagNumber = '+ sql.escape(formData.tagNum)
          async.parallel([
              function(queryDB) {
                  poolTemp.query(query27, {}, function(err, results) {
                      if (err){
                          return queryDB(err)
                      }else{

                          queryDB()
                      }

                  })
              },

              ], function(err) {
                  if (err){
                      console.log(err)
                  } else {
                    //Insert initiative outcomes monitored data
                    for(var i = 0; i < formData.initiativeOutcomesMonitored.length; i++) {
                      var query28 = 'INSERT into initiativemonitoredoutcomes VALUES ('+sql.escape(formData.tagNum) +','+ sql.escape(formData.initiativeOutcomesMonitored[i])+')'
                      async.parallel([
                          function(queryDB) {
                              poolTemp.query(query28, {}, function(err, results) {
                                  if (err){
                                      return queryDB(err)
                                  }else{
                                      queryDB()
                                  }
                              })
                          },
                      ], function(err) {
                          if (err){
                              console.log(err)
                          }
                      })
                    }
                }
          })


          //delete initiative main education subsector data
          var query29= 'DELETE FROM initiativemaineducationsubsector WHERE tagNumber = '+ sql.escape(formData.tagNum)
          async.parallel([
            function(queryDB) {
                poolTemp.query(query29, {}, function(err, results) {
                    if (err){
                        return queryDB(err)
                    }else{
                        queryDB()
                    }
                })
              },
            ], function(err) {
                if (err){
                    console.log(err)
                } else {
                  //Insert initiative main education subsector data
                  for(var i = 0; i < formData.initiativeMEdSubs.length; i++) {
                    var query30 = 'INSERT into initiativemaineducationsubsector VALUES ('+sql.escape(formData.tagNum) + ',(SELECT educationSubsector FROM educationsubsector WHERE educationSubsector =' + sql.escape(formData.initiativeMEdSubs[i])+'))'
                    async.parallel([
                        function(queryDB) {
                            poolTemp.query(query30, {}, function(err, results) {
                                if (err){
                                    return queryDB(err)
                                }else{
                                    queryDB()
                                }
                            })
                        },

                    ], function(err) {
                        if (err){
                            console.log(err)
                        }

                    })
                  }
                }
          })


          //delete initiativeeducationsubsectors data
          var query31= 'DELETE FROM initiativeeducationsubsectors WHERE initiativeTagNumber = '+ sql.escape(formData.tagNum)
          async.parallel([
              function(queryDB) {
                  poolTemp.query(query31, {}, function(err, results) {
                      if (err){
                          return queryDB(err)
                      }else{

                          queryDB()
                      }

                  })
                },
              ], function(err) {
                  if (err){
                      console.log(err)
                  } else {
                    //Insert initiative education subsector data
                    for(var i = 0; i < formData.initiativeOEdSubs.length; i++) {
                      var query32 = 'INSERT into initiativeeducationsubsectors VALUES ('+sql.escape(formData.tagNum) + ',(SELECT educationSubsector FROM educationsubsector WHERE educationSubsector =' + sql.escape(formData.initiativeOEdSubs[i])+ '))'
                      async.parallel([
                          function(queryDB) {
                              poolTemp.query(query32, {}, function(err, results) {
                                  if (err){
                                      return queryDB(err)
                                  }else{
                                      queryDB()
                                  }
                              })
                          },

                      ], function(err) {
                          if (err){
                              console.log(err)
                          }
                      })
                    }
                }
          })


          //delete initiativetargetschoolmanagement data
          var query33= 'DELETE FROM initiativetargetschoolmanagement WHERE tagNumber = '+ sql.escape(formData.tagNum)
          async.parallel([
              function(queryDB) {
                  poolTemp.query(query33, {}, function(err, results) {
                      if (err){
                          return queryDB(err)
                      }else{
                          queryDB()
                      }
                  })
                },
              ], function(err) {
                  if (err){
                      console.log(err)
                  } else {
                    //Insert initiative target management data
                    for(var i = 0; i < formData.initiativeManagementTypes.length; i++) {
                      var query34 = 'INSERT into initiativetargetschoolmanagement VALUES ('+sql.escape(formData.tagNum) +','+ sql.escape(formData.initiativeManagementTypes[i])+')'
                      async.parallel([
                          function(queryDB) {
                              poolTemp.query(query34, {}, function(err, results) {
                                  if (err){
                                      return queryDB(err)
                                  }else{
                                      queryDB()
                                  }
                              })
                          },

                      ], function(err) {
                          if (err){
                              console.log(err)
                          }
                      })
                    }
                  }

              })

          //Count number of initiatives this funder funds
          async.parallel([
            function(queryDB) {
                poolTemp.query(queryNumFunders, {}, function(err, results) {
                    if (err){
                        return queryDB(err)
                    }else{
                        queryDB()
                    }
                })
            },
          ], function(err) {
              if (err){
                  console.log(err)
              } else {
                numFunders = JSON.parse(JSON.stringify(results[0][0]['COUNT(funderName)']));
                // funder - funds - relationship
                //If funder already existed in main but not yet in temp
                var query36;
                if (numFunderInitiatives == 0) {
                  if (numFunders == 0) {
                    query36 = 'INSERT into funds VALUES (' + sql.escape(formData.tagNum) + ',' + sql.escape(formData.funderName) +  ','  + sql.escape(formData.initiativeStart) +  ','  + sql.escape(formData.initiativeEnd) +  ')'
                  } else {
                    query36 = 'UPDATE funds SET funderName = (SELECT funderName FROM funder WHERE funderName ='
                    + sql.escape(formData.funderName) +  '), startYear = ' + sql.escape(formData.initiativeStart) +  ', endYear ='  + sql.escape(formData.initiativeEnd) + ' WHERE (tagNum ='  + sql.escape(formData.tagNum) + ')'
                  }
                } else {
                  query36 = 'UPDATE funds SET funderName = (SELECT funderName FROM funder WHERE funderName ='
                  + sql.escape(formData.funderName)+ '), startYear = '+sql.escape(formData.initiativeStart) + ', endYear =' + sql.escape(formData.initiativeEnd) +' WHERE (tagNum =' + sql.escape(formData.tagNum) + ') AND (funderName = '
                  + sql.escape(formData.OfunderName) +')'
                }

                async.parallel([
                    function(queryDB) {
                        poolTemp.query(query36, {}, function(err, results) {
                            if (err){
                                return queryDB(err)
                            }else{
                                queryDB()
                            }

                        })
                      },
                    ], function(err) {
                        if (err){
                            console.log(err)
                        }
                    })
                  }
              })

        var query38;
        var queryNumComments = 'SELECT COUNT(tagNumber) FROM comments WHERE tagNumber = ' + sql.escape(formData.tagNum) //Check if comments exist in temp db for this form
        async.parallel([
            function(queryDB) {
                poolTemp.query(queryNumComments, {}, function(err, results) {
                    if (err){
                        return queryDB(err, null)
                    }else{
                        queryDB(null, results)
                    }
                })
            },

          ], function(err, results) {
                if (err){
                    console.log(err)
                } else {
                  let numComments = JSON.parse(JSON.stringify(results[0][0]['COUNT(tagNumber)']));
                  //If comments row for this form doesn't exist in temp db, then insert it. Otherwise, update comments
                  if (numComments > 0) {
                    query38 = 'UPDATE comments SET comment = ' + sql.escape(formData.comments) + ' WHERE tagNumber = '+ sql.escape(formData.tagNum)
                  } else {
                    query38 = 'INSERT INTO comments VALUES (' + sql.escape(formData.tagNum) + ',' + sql.escape(formData.comments) + ')'
                  }
                  async.parallel([
                      function(queryDB) {
                          poolTemp.query(query38, {}, function(err, results) {
                              if (err){
                                  return queryDB(err)
                              }else{
                                  queryDB()
                              }
                          })
                      },
                    ], function(err) {
                        if (err){
                            console.log(err)
                        }
                  })
                }
            })


            var query39;
            var queryNumStatus = 'SELECT COUNT(tagNumber) FROM status WHERE tagNumber = ' + sql.escape(formData.tagNum) //Check if status exist in temp db for this form
            async.parallel([
                function(queryDB) {
                    poolTemp.query(queryNumStatus, {}, function(err, results) {
                        if (err){
                            return queryDB(err, null)
                        }else{
                            queryDB(null, results)
                        }
                    })
                },

              ], function(err, results) {
                    if (err){
                        console.log(err)
                    } else {
                      let numStatus = JSON.parse(JSON.stringify(results[0][0]['COUNT(tagNumber)']));
                      //If comments row for this form doesn't exist in temp db, then insert it. Otherwise, update comments
                      if (numStatus > 0) {
                        query39 = 'UPDATE status SET inDB = ' +sql.escape(formData.inDB) + ', needsReview =' + sql.escape(formData.needsReview) + ' WHERE tagNumber = '+sql.escape(formData.tagNum)
                      } else {
                        query39 = 'INSERT INTO status VALUES ('+ sql.escape(formData.tagNum) + ','+ sql.escape(formData.inDB) + ',' + sql.escape(formData.needsReview) + ')'
                      }
                      async.parallel([
                          function(queryDB) {
                              poolTemp.query(query39, {}, function(err, results) {
                                  if (err){
                                      return queryDB(err)
                                  }else{
                                      queryDB()
                                  }
                              })
                          },
                        ], function(err) {
                            if (err){
                                console.log(err)
                            }
                      })
                  }
            })

            var query40;
            var queryNumReviews = 'SELECT COUNT(tagNumber) FROM sectionreviews WHERE tagNumber = ' + sql.escape(formData.tagNum) //Check if section reviews exist in temp db for this form
            async.parallel([
                function(queryDB) {
                    poolTemp.query(queryNumReviews, {}, function(err, results) {
                        if (err){
                            return queryDB(err, null)
                        }else{
                            queryDB(null, results)
                        }
                    })
                },

              ], function(err, results) {
                    if (err){
                        console.log(err)
                    } else {
                      let numReviews = JSON.parse(JSON.stringify(results[0][0]['COUNT(tagNumber)']));
                      //If comments row for this form doesn't exist in temp db, then insert it. Otherwise, update comments
                      if (numReviews > 0) {
                        query40 = 'UPDATE sectionreviews SET funderNameApproval = '+
                        sql.escape(formData.funderNameApproval) + ',funderUrlApproval = ' +
                        sql.escape(formData.funderUrlApproval) + ',funderMotiveApproval = ' +
                        sql.escape(formData.funderMotiveApproval) + ',funderImpactApproval = ' +
                        sql.escape(formData.funderImpactApproval) + ',funderOrganizationFormApproval = ' +
                        sql.escape(formData.funderOrganizationFormApproval) + ',funderInternationalBaseApproval = ' +
                        sql.escape(formData.funderInternationalBaseApproval) + ',funderEdSubsApproval  = ' +
                        sql.escape(formData.funderEdSubsApproval) + ',funderOrgTraitsApproval = ' +
                        sql.escape(formData.funderOrgTraitsApproval)+ ',funderAsiaBasesApproval= ' +
                        sql.escape(formData.funderAsiaBasesApproval)+ ',funderAsiaOperationsApproval= ' +
                        sql.escape(formData.funderAsiaOperationsApproval)+ ',initNameApproval = ' +
                        sql.escape(formData.initNameApproval) + ',initUrlApproval  = ' +
                        sql.escape(formData.initUrlApproval)+ ',initTargetsWomenApproval = ' +
                        sql.escape(formData.initTargetsWomenApproval)+ ',initStartApproval = ' +
                        sql.escape(formData.initStartApproval)+ ',initEndApproval = ' +
                        sql.escape(formData.initEndApproval)+ ',initDescriptionApproval = ' +
                        sql.escape(formData.initDescriptionApproval)+ ',initProgramAreasApproval = ' +
                        sql.escape(formData.initProgramAreasApproval)+ ',initMainProgramActivityApproval = ' +
                        sql.escape(formData.initMainProgramActivityApproval)+ ',initFeeAccessApproval = ' +
                        sql.escape(formData.initFeeAccessApproval)+ ',initRegionsApproval = ' +
                        sql.escape(formData.initRegionsApproval)+ ',initCountriesApproval = ' +
                        sql.escape(formData.initCountriesApproval)+ ',initActivitiesApproval = ' +
                        sql.escape(formData.initActivitiesApproval) + ', initSourceOfFeesApproval = ' +
                        sql.escape(formData.initSourceOfFeesApproval)+ ',initLaunchCountryApproval = ' +
                        sql.escape(formData.initLaunchCountryApproval)+ ',initTargetGeoApproval = ' +
                        sql.escape(formData.initTargetGeoApproval)+ ',initTargetPopulationSectorApproval = ' +
                        sql.escape(formData.initTargetPopulationSectorApproval)+ ',initOutcomesMonitoredApproval = ' +
                        sql.escape(formData.initOutcomesMonitoredApproval)+ ',initMEdSubsApproval = ' +
                        sql.escape(formData.initMEdSubsApproval)+ ',initOEdSubsApproval = ' +
                        sql.escape(formData.initOEdSubsApproval) + ', initManagementTypesApproval = ' +
                        sql.escape(formData.initManagementTypesApproval)+ ',implementorNameApproval = ' +
                        sql.escape(formData.implementorNameApproval)+ ',implementorMotiveApproval = ' +
                        sql.escape(formData.implementorMotiveApproval) + ' WHERE tagNumber = '+sql.escape(formData.tagNum)
                      } else {
                        query40 = 'INSERT INTO sectionreviews VALUES ('+ sql.escape(formData.tagNum) + ',' +
                        sql.escape(formData.funderNameApproval) + ',' +
                        sql.escape(formData.funderUrlApproval) + ',' +
                        sql.escape(formData.funderMotiveApproval) + ',' +
                        sql.escape(formData.funderImpactApproval) + ',' +
                        sql.escape(formData.funderOrganizationFormApproval) + ',' +
                        sql.escape(formData.funderInternationalBaseApproval) + ',' +
                        sql.escape(formData.funderEdSubsApproval) + ',' +
                        sql.escape(formData.funderOrgTraitsApproval)+ ',' +
                        sql.escape(formData.funderAsiaBasesApproval)+ ',' +
                        sql.escape(formData.funderAsiaOperationsApproval)+ ',' +
                        sql.escape(formData.initNameApproval) + ',' +
                        sql.escape(formData.initUrlApproval)+ ',' +
                        sql.escape(formData.initTargetsWomenApproval)+ ',' +
                        sql.escape(formData.initStartApproval)+ ',' +
                        sql.escape(formData.initEndApproval)+ ',' +
                        sql.escape(formData.initDescriptionApproval)+ ',' +
                        sql.escape(formData.initProgramAreasApproval)+ ',' +
                        sql.escape(formData.initMainProgramActivityApproval)+ ',' +
                        sql.escape(formData.initFeeAccessApproval)+ ',' +
                        sql.escape(formData.initRegionsApproval)+ ',' +
                        sql.escape(formData.initCountriesApproval)+ ',' +
                        sql.escape(formData.initActivitiesApproval) + ',' +
                        sql.escape(formData.initSourceOfFeesApproval)+ ',' +
                        sql.escape(formData.initLaunchCountryApproval)+ ',' +
                        sql.escape(formData.initTargetGeoApproval)+ ',' +
                        sql.escape(formData.initTargetPopulationSectorApproval)+ ',' +
                        sql.escape(formData.initOutcomesMonitoredApproval)+ ',' +
                        sql.escape(formData.initMEdSubsApproval)+ ',' +
                        sql.escape(formData.initOEdSubsApproval) + ',' +
                        sql.escape(formData.initManagementTypesApproval)+ ',' +
                        sql.escape(formData.implementorNameApproval)+ ',' +
                        sql.escape(formData.implementorMotiveApproval) +')'
                      }
                      async.parallel([
                          function(queryDB) {
                              poolTemp.query(query40, {}, function(err, results) {
                                  if (err){
                                      return queryDB(err)
                                  }else{
                                      queryDB()
                                  }
                              })
                          },
                        ], function(err) {
                            if (err){
                                console.log(err)
                            }
                      })
                    }
                })
        }
    })

    ///////////////////////////////Update implements and implementor tables
    var numImplementerInitiatives;  //Number of initiatives implemented by implementer
    var numImplementers;  //Number of implementers with the current tagNum associated to them
    var queryNumImplementerInitiatives = 'SELECT COUNT(implementorName) FROM implements WHERE implementorName = ' + sql.escape(formData.OimplementorName) //Get number of initiatives funded by funder
    var queryNumImplementers = 'SELECT COUNT(implementorName) FROM implements WHERE tagNum = ' + sql.escape(formData.tagNum)

    var query41;
    async.parallel([
     function(queryDB) {
         poolTemp.query(queryNumImplementerInitiatives, {}, function(err, results) {
             if (err){
                 return queryDB(err, null)
             }else{
                 queryDB(null, results)
             }
         })
     },

   ], function(err, results) {
         if (err){
           console.log(err)
         } else {
             numImplementerInitiatives = JSON.parse(JSON.stringify(results[0][0]['COUNT(implementorName)']));
             //If implementer existed in main already but hasnt been added to temp db yet
             if (numImplementerInitiatives == 0) {
               query41 = 'INSERT into implementor VALUES (' + sql.escape(formData.implementorName) + ',' + sql.escape(formData.implementorMotive) + ')'
             } else {
               if (numImplementerInitiatives > 1 && formData.implementorName !== formData.OimplementorName) {
                 query41 = 'INSERT into implementor VALUES (' + sql.escape(formData.implementorName) + ',' + sql.escape(formData.implementorMotive) + ')'
               }
               else {
                 query41 = 'UPDATE implementor SET implementorName =' + sql.escape(formData.implementorName) + ', profitMotive =' + sql.escape(formData.implementorMotive)+' WHERE implementorName = '+ sql.escape(formData.OimplementorName)
               }
             }

             async.parallel([
              function(queryDB) {
                  poolTemp.query(query41, {}, function(err, results) {
                      if (err){
                          return queryDB(err)
                      }else{
                          queryDB()
                      }
                  })
                },
              ], function(err) {
                  if (err){
                      console.log(err)
                  }
              })

              async.parallel([
                function(queryDB) {
                    poolTemp.query(queryNumImplementers, {}, function(err, results) {
                        if (err){
                            return queryDB(err)
                        }else{
                            queryDB()
                        }
                    })
                },
              ], function(err) {
                  if (err){
                      console.log(err)
                  } else {
                    numImplementers = JSON.parse(JSON.stringify(results[0][0]['COUNT(implementorName)']));
                    //implementor - implements - initiative
                    //If implementer already existed in main but not yet in temp
                    var query42;
                    if (numImplementerInitiatives == 0) {
                      if (numImplementers == 0) {
                        query42 = 'INSERT into implements VALUES (' + sql.escape(formData.tagNum) + ',' + sql.escape(formData.implementorName) + ',' + sql.escape(formData.initiativeStart) + ',' + sql.escape(formData.initiativeEnd) + ')'
                      } else {
                        query42 = 'UPDATE implements SET implementorName = (SELECT implementorName from implementor WHERE implementorName ='+ sql.escape(formData.implementorName) + ') WHERE (tagNum =' + sql.escape(formData.tagNum) + ')'
                      }
                    } else {
                      query42 = 'UPDATE implements SET implementorName = (SELECT implementorName from implementor WHERE implementorName =' + sql.escape(formData.implementorName) + ') WHERE (tagNum =' + sql.escape(formData.tagNum) + ') AND (implementorName = ' + sql.escape(formData.OimplementorName) + ')'
                    }

                    async.parallel([
                      function(queryDB) {
                          poolTemp.query(query42, {}, function(err, results) {
                              if (err){
                                  return queryDB(err)
                              }else{
                                  queryDB()
                              }
                          })
                        },
                      ], function(err) {
                          if (err){
                              console.log(err)
                          }
                      })
                  }
            })
        }
    })

    res.send("Inves431_girlsEd updated successfully!")
  } else {
    res.json({"error": "Error: Action not authorized"})
  }
})

//delete form from database
dashboard.post('/delete-funder/:funder', (req,res) =>{
  if(req.user){
    var funderName = req.params.funder

    //delete funds
    var query1 = "DELETE FROM funds WHERE funderName = '"+ funderName+ "'"
    async.parallel([
        function(queryDB) {
            pool.query(query1, {}, function(err, results) {
                if (err){
                    return queryDB(err)
                }else{

                    queryDB()
                }

            })
        },
        ], function(err) {
            if (err){
                console.log(err)
            }

        })

    //delete funder asia bases
    var query2 = "DELETE FROM funderasiabases WHERE funderName ='" +funderName+"'"
    async.parallel([
        function(queryDB) {
            pool.query(query2, {}, function(err, results) {
                if (err){
                    return queryDB(err)
                }else{

                    queryDB()
                }

            })
        },
        ], function(err) {
            if (err){
                console.log(err)
            }

        })

    //delete funder asia operations
    var query3 = "DELETE FROM funderasiaoperations WHERE funderName ='" +funderName+"'"
    async.parallel([
        function(queryDB) {
            pool.query(query3, {}, function(err, results) {
                if (err){
                    return queryDB(err)
                }else{

                    queryDB()
                }

            })
        },
        ], function(err) {
            if (err){
                console.log(err)
            }

        })

    //delete funder education subsector
    var query4 = "DELETE FROM fundereducationsubsectors WHERE funderName ='" +funderName+"'"
    async.parallel([
        function(queryDB) {
            pool.query(query4, {}, function(err, results) {
                if (err){
                    return queryDB(err)
                }else{

                    queryDB()
                }

            })
        },
        ], function(err) {
            if (err){
                console.log(err)
            }

        })
    //delete funder international bases
    var query5 = "DELETE FROM funderinternationalbases WHERE funderName ='" +funderName+"'"
    async.parallel([
        function(queryDB) {
            pool.query(query5, {}, function(err, results) {
                if (err){
                    return queryDB(err)
                }else{

                    queryDB()
                }

            })
        },
        ], function(err) {
            if (err){
                console.log(err)
            }

        })


    //delete funder organization traits
    var query6 = "DELETE FROM funderorganizationtraits WHERE funderName ='" +funderName+"'"
    async.parallel([
        function(queryDB) {
            pool.query(query6, {}, function(err, results) {
                if (err){
                    return queryDB(err)
                }else{

                    queryDB()
                }

            })
        },
        ], function(err) {
            if (err){
                console.log(err)
            }

        })

    //delete funder
     var query7 = "DELETE FROM funder WHERE funderName ='" +funderName+"'"
     async.parallel([
         function(queryDB) {
             pool.query(query7, {}, function(err, results) {
                 if (err){
                     return queryDB(err)
                 }else{

                     queryDB()
                 }

             })
         },
         ], function(err) {
             if (err){
                 console.log(err)
             }

         })

    res.send("Funder deleted successfully!")
  } else {
    res.json({"error": "Error: Action not authorized"})
  }
})

dashboard.post('/delete-funder-temp/:funder', (req,res)=>{
  if(req.user) {
    var funderName = req.params.funder

    //delete funds
    var query1 = "DELETE FROM funds WHERE funderName = '"+ funderName+ "'"
    async.parallel([
        function(queryDB) {
            poolTemp.query(query1, {}, function(err, results) {
                if (err){
                    return queryDB(err)
                }else{

                    queryDB()
                }

            })
        },
        ], function(err) {
            if (err){
                console.log(err)
            }

        })

    //delete funder asia bases
    var query2 = "DELETE FROM funderasiabases WHERE funderName ='" +funderName+"'"
    async.parallel([
        function(queryDB) {
            poolTemp.query(query2, {}, function(err, results) {
                if (err){
                    return queryDB(err)
                }else{

                    queryDB()
                }

            })
        },
        ], function(err) {
            if (err){
                console.log(err)
            }

        })

    //delete funder asia operations
    var query3 = "DELETE FROM funderasiaoperations WHERE funderName ='" +funderName+"'"
    async.parallel([
        function(queryDB) {
            poolTemp.query(query3, {}, function(err, results) {
                if (err){
                    return queryDB(err)
                }else{

                    queryDB()
                }

            })
        },
        ], function(err) {
            if (err){
                console.log(err)
            }

        })

    //delete funder education subsector
    var query4 = "DELETE FROM fundereducationsubsectors WHERE funderName ='" +funderName+"'"
    async.parallel([
        function(queryDB) {
            poolTemp.query(query4, {}, function(err, results) {
                if (err){
                    return queryDB(err)
                }else{

                    queryDB()
                }

            })
        },
        ], function(err) {
            if (err){
                console.log(err)
            }

        })
    //delete funder international bases
    var query5 = "DELETE FROM funderinternationalbases WHERE funderName ='" +funderName+"'"
    async.parallel([
        function(queryDB) {
            poolTemp.query(query5, {}, function(err, results) {
                if (err){
                    return queryDB(err)
                }else{

                    queryDB()
                }

            })
        },
        ], function(err) {
            if (err){
                console.log(err)
            }

        })


    //delete funder organization traits
    var query6 = "DELETE FROM funderorganizationtraits WHERE funderName ='" +funderName+"'"
    async.parallel([
        function(queryDB) {
            poolTemp.query(query6, {}, function(err, results) {
                if (err){
                    return queryDB(err)
                }else{

                    queryDB()
                }

            })
        },
        ], function(err) {
            if (err){
                console.log(err)
            }

        })

    //delete funder
     var query7 = "DELETE FROM funder WHERE funderName ='" +funderName+"'"
     async.parallel([
         function(queryDB) {
             poolTemp.query(query7, {}, function(err, results) {
                 if (err){
                     return queryDB(err)
                 }else{

                     queryDB()
                 }

             })
         },
         ], function(err) {
             if (err){
                 console.log(err)
             }

         })

    res.send("Funder deleted successfully!")
  } else {
    res.json({"error": "Error: Action not authorized"})
  }
})

//delete implementor from db
dashboard.post('/delete-implementor/:iname', (req,res) =>{
  if(req.user){
    var implementorName = req.params.iname

    //delete implementor
    var query1 = "DELETE FROM implementor WHERE implementorName ='" +implementorName+"'"
    async.parallel([
        function(queryDB) {
            pool.query(query1, {}, function(err, results) {
                if (err){
                    return queryDB(err)
                }else{

                    queryDB()
                }

            })
        },
        ], function(err) {
            if (err){
                console.log(err)
            }

        })

        //delete from implements
        var query2 = "DELETE FROM implements WHERE implementorName ='" +implementorName+"'"
        async.parallel([
            function(queryDB) {
                pool.query(query2, {}, function(err, results) {
                    if (err){
                        return queryDB(err)
                    }else{

                        queryDB()
                    }

                })
            },
            ], function(err) {
                if (err){
                    console.log(err)
                }

            })

    res.send("Implementor deleted successfully!")
  } else {
    res.json({"error": "Error: Action not authorized"})
  }
})

//delete implementor from temp db
dashboard.post('/delete-implementor-temp/:iname', (req,res) =>{
  if(req.user){
    var implementorName = req.params.iname

    //delete implementor
    var query1 = "DELETE FROM implementor WHERE implementorName ='" +implementorName+"'"
    async.parallel([
        function(queryDB) {
            poolTemp.query(query1, {}, function(err, results) {
                if (err){
                    return queryDB(err)
                }else{

                    queryDB()
                }

            })
        },
        ], function(err) {
            if (err){
                console.log(err)
            }

        })

        //delete from implements
        var query2 = "DELETE FROM implements WHERE implementorName ='" +implementorName+"'"
        async.parallel([
            function(queryDB) {
                poolTemp.query(query2, {}, function(err, results) {
                    if (err){
                        return queryDB(err)
                    }else{

                        queryDB()
                    }

                })
            },
            ], function(err) {
                if (err){
                    console.log(err)
                }

            })

    res.send("Implementor deleted successfully!")
  } else {
    res.json({"error": "Error: Action not authorized"})
  }
})

//delete intiative from db
dashboard.post('/delete-initiative/:tagNum', (req,res) =>{
  if(req.user){
    var tagNumber = req.params.tagNum

    //delete funds
    var query1 = "DELETE FROM initiative WHERE tagNumber ="+ tagNumber
    async.parallel([
        function(queryDB) {
            pool.query(query1, {}, function(err, results) {
                if (err){
                    return queryDB(err)
                }else{

                    queryDB()
                }

            })
        },
        ], function(err) {
            if (err){
                console.log(err)
            }

        })


    //delete initiative region data
    var query2= "DELETE FROM initiativeregion WHERE tagNumber = "+ tagNumber
    async.parallel([
        function(queryDB) {
            pool.query(query2, {}, function(err, results) {
                if (err){
                    return queryDB(err)
                }else{

                    queryDB()
                }

            })
        },

        ], function(err) {
            if (err){
                console.log(err)
            }

        })
 //delete initiativecountryofoperation data
    var query3= "DELETE FROM initiativecountryofoperation WHERE tagNumber = "+ tagNumber
    async.parallel([
        function(queryDB) {
            pool.query(query3, {}, function(err, results) {
                if (err){
                    return queryDB(err)
                }else{

                    queryDB()
                }

            })
        },

        ], function(err) {
            if (err){
                console.log(err)
            }

        })
//delete initiativeprogrammingactivities data
    var query4= "DELETE FROM initiativeprogrammingactivities WHERE tagNumber = "+ tagNumber
    async.parallel([
        function(queryDB) {
            pool.query(query4, {}, function(err, results) {
                if (err){
                    return queryDB(err)
                }else{

                    queryDB()
                }

            })
        },

        ], function(err) {
            if (err){
                console.log(err)
            }

        })
  //delete initiativefundingsource data
      var query5= "DELETE FROM initiativefundingsource WHERE tagNumber = "+ tagNumber
      async.parallel([
          function(queryDB) {
              pool.query(query5, {}, function(err, results) {
                  if (err){
                      return queryDB(err)
                  }else{

                      queryDB()
                  }

              })
          },

          ], function(err) {
              if (err){
                  console.log(err)
              }

          })
     //delete launchcountry data
     var query6= "DELETE FROM initiativelaunchcountry WHERE tagNumber = "+ tagNumber
     async.parallel([
         function(queryDB) {
             pool.query(query6, {}, function(err, results) {
                 if (err){
                     return queryDB(err)
                 }else{

                     queryDB()
                 }

             })
         },

         ], function(err) {
             if (err){
                 console.log(err)
             }

         })
 //delete initiativetargetgeography data
     var query7= "DELETE FROM initiativetargetgeography WHERE tagNumber = "+ tagNumber
     async.parallel([
         function(queryDB) {
             pool.query(query7, {}, function(err, results) {
                 if (err){
                     return queryDB(err)
                 }else{

                     queryDB()
                 }

             })
         },

         ], function(err) {
             if (err){
                 console.log(err)
             }

         })
 //delete INSERT into initiativetargetpopulationsector data
    var query8= "DELETE FROM initiativetargetpopulationsector WHERE tagNumber = "+ tagNumber
    async.parallel([
        function(queryDB) {
            pool.query(query8, {}, function(err, results) {
                if (err){
                    return queryDB(err)
                }else{

                    queryDB()
                }

            })
        },

        ], function(err) {
            if (err){
                console.log(err)
            }

        })
    //delete initiativemonitoredoutcomes data
    var query9= "DELETE FROM initiativemonitoredoutcomes WHERE tagNumber = "+ tagNumber
    async.parallel([
        function(queryDB) {
            pool.query(query9, {}, function(err, results) {
                if (err){
                    return queryDB(err)
                }else{

                    queryDB()
                }

            })
        },

        ], function(err) {
            if (err){
                console.log(err)
            }

        })
//delete initiativemonitoredoutcomes data
     var query10= "DELETE FROM initiativemonitoredoutcomes WHERE tagNumber = "+ tagNumber
     async.parallel([
         function(queryDB) {
             pool.query(query10, {}, function(err, results) {
                 if (err){
                     return queryDB(err)
                 }else{

                     queryDB()
                 }

             })
         },

         ], function(err) {
             if (err){
                 console.log(err)
             }

         })
    //delete initiativeeducationsubsectors data
    var query11= "DELETE FROM initiativeeducationsubsectors WHERE initiativeTagNumber = "+ tagNumber
    async.parallel([
        function(queryDB) {
            pool.query(query11, {}, function(err, results) {
                if (err){
                    return queryDB(err)
                }else{

                    queryDB()
                }

            })
        },

        ], function(err) {
            if (err){
                console.log(err)
            }

        })
    //delete initiativetargetschoolmanagement data
    var query12= "DELETE FROM initiativetargetschoolmanagement WHERE tagNumber = "+ tagNumber
    async.parallel([
        function(queryDB) {
            pool.query(query12, {}, function(err, results) {
                if (err){
                    return queryDB(err)
                }else{

                    queryDB()
                }

            })
        },

        ], function(err) {
            if (err){
                console.log(err)
            }

        })

    res.send("Initiative deleted successfully!")
  } else {
    res.json({"error": "Error: Action not authorized"})
  }
})

//delete intiative from temp db
dashboard.post('/delete-initiative-temp/:tagNum', (req,res) =>{
  if(req.user){
    var tagNumber = req.params.tagNum

    //delete funds
    var query1 = "DELETE FROM initiative WHERE tagNumber ="+ tagNumber
    async.parallel([
        function(queryDB) {
            poolTemp.query(query1, {}, function(err, results) {
                if (err){
                    return queryDB(err)
                }else{

                    queryDB()
                }

            })
        },
        ], function(err) {
            if (err){
                console.log(err)
            }

        })


    //delete initiative region data
    var query2= "DELETE FROM initiativeregion WHERE tagNumber = "+ tagNumber
    async.parallel([
        function(queryDB) {
            poolTemp.query(query2, {}, function(err, results) {
                if (err){
                    return queryDB(err)
                }else{

                    queryDB()
                }

            })
        },

        ], function(err) {
            if (err){
                console.log(err)
            }

        })
 //delete initiativecountryofoperation data
    var query3= "DELETE FROM initiativecountryofoperation WHERE tagNumber = "+ tagNumber
    async.parallel([
        function(queryDB) {
            poolTemp.query(query3, {}, function(err, results) {
                if (err){
                    return queryDB(err)
                }else{

                    queryDB()
                }

            })
        },

        ], function(err) {
            if (err){
                console.log(err)
            }

        })
//delete initiativeprogrammingactivities data
    var query4= "DELETE FROM initiativeprogrammingactivities WHERE tagNumber = "+ tagNumber
    async.parallel([
        function(queryDB) {
            poolTemp.query(query4, {}, function(err, results) {
                if (err){
                    return queryDB(err)
                }else{

                    queryDB()
                }

            })
        },

        ], function(err) {
            if (err){
                console.log(err)
            }

        })
  //delete initiativefundingsource data
      var query5= "DELETE FROM initiativefundingsource WHERE tagNumber = "+ tagNumber
      async.parallel([
          function(queryDB) {
              poolTemp.query(query5, {}, function(err, results) {
                  if (err){
                      return queryDB(err)
                  }else{

                      queryDB()
                  }

              })
          },

          ], function(err) {
              if (err){
                  console.log(err)
              }

          })
     //delete launchcountry data
     var query6= "DELETE FROM initiativelaunchcountry WHERE tagNumber = "+ tagNumber
     async.parallel([
         function(queryDB) {
             poolTemp.query(query6, {}, function(err, results) {
                 if (err){
                     return queryDB(err)
                 }else{

                     queryDB()
                 }

             })
         },

         ], function(err) {
             if (err){
                 console.log(err)
             }

         })
 //delete initiativetargetgeography data
     var query7= "DELETE FROM initiativetargetgeography WHERE tagNumber = "+ tagNumber
     async.parallel([
         function(queryDB) {
             poolTemp.query(query7, {}, function(err, results) {
                 if (err){
                     return queryDB(err)
                 }else{

                     queryDB()
                 }

             })
         },

         ], function(err) {
             if (err){
                 console.log(err)
             }

         })
 //delete INSERT into initiativetargetpopulationsector data
    var query8= "DELETE FROM initiativetargetpopulationsector WHERE tagNumber = "+ tagNumber
    async.parallel([
        function(queryDB) {
            poolTemp.query(query8, {}, function(err, results) {
                if (err){
                    return queryDB(err)
                }else{

                    queryDB()
                }

            })
        },

        ], function(err) {
            if (err){
                console.log(err)
            }

        })
    //delete initiativemonitoredoutcomes data
    var query9= "DELETE FROM initiativemonitoredoutcomes WHERE tagNumber = "+ tagNumber
    async.parallel([
        function(queryDB) {
            poolTemp.query(query9, {}, function(err, results) {
                if (err){
                    return queryDB(err)
                }else{

                    queryDB()
                }

            })
        },

        ], function(err) {
            if (err){
                console.log(err)
            }

        })
//delete initiativemonitoredoutcomes data
     var query10= "DELETE FROM initiativemonitoredoutcomes WHERE tagNumber = "+ tagNumber
     async.parallel([
         function(queryDB) {
             poolTemp.query(query10, {}, function(err, results) {
                 if (err){
                     return queryDB(err)
                 }else{

                     queryDB()
                 }

             })
         },

         ], function(err) {
             if (err){
                 console.log(err)
             }

         })
    //delete initiativeeducationsubsectors data
    var query11= "DELETE FROM initiativeeducationsubsectors WHERE initiativeTagNumber = "+ tagNumber
    async.parallel([
        function(queryDB) {
            poolTemp.query(query11, {}, function(err, results) {
                if (err){
                    return queryDB(err)
                }else{

                    queryDB()
                }

            })
        },

        ], function(err) {
            if (err){
                console.log(err)
            }

        })
    //delete initiativetargetschoolmanagement data
    var query12= "DELETE FROM initiativetargetschoolmanagement WHERE tagNumber = "+ tagNumber
    async.parallel([
        function(queryDB) {
            poolTemp.query(query12, {}, function(err, results) {
                if (err){
                    return queryDB(err)
                }else{

                    queryDB()
                }

            })
        },

        ], function(err) {
            if (err){
                console.log(err)
            }

        })
    res.send("Initiative deleted successfully!")
  } else {
    res.json({"error": "Error: Action not authorized"})
  }
})
module.exports = dashboard
