# -*- coding: utf-8 -*-
import json
# this file is released under public domain and you can use without limitations

# -------------------------------------------------------------------------
# This is a sample controller
# - index is the default action of any application
# - user is required for authentication and authorization
# - download is for downloading files uploaded in the db (does streaming)
# -------------------------------------------------------------------------


def index():
    """
    example action using the internationalization operator T and flash
    rendered by views/default/index.html or views/generic.html

    if you need a simple wiki simply replace the two lines below with:
    return auth.wiki()
    """
    #response.flash = T("hello quickmeet")
    #return dict(message=T('My first application!'))
    #response.files('calendar.css','CalendarGenerator.js')CoordinateTracker

    return locals()

def user():
    """
    exposes:
    http://..../[app]/default/user/login
    http://..../[app]/default/user/logout
    http://..../[app]/default/user/register
    http://..../[app]/default/user/profile
    http://..../[app]/default/user/retrieve_password
    http://..../[app]/default/user/change_password
    http://..../[app]/default/user/bulk_register
    use @auth.requires_login()
        @auth.requires_membership('group name')
        @auth.requires_permission('read','table name',record_id)
    to decorate functions that need access control
    also notice there is http://..../[app]/appadmin/manage/auth to allow administrator to manage users
    """
    return dict(form=auth())

def group():
    return locals()
    

@cache.action()
def download():
    """
    allows downloading of uploaded files
    http://..../[app]/default/download/[filename]
    """
    return response.download(request, db)


def call():
    """
    exposes services. for example:
    http://..../[app]/default/call/jsonrpc
    decorate with @services.jsonrpc the functions to expose
    supports xml, json, xmlrpc, jsonrpc, amfrpc, rss, csv
    """
    return service()


#RESTFUL API
#It does not require auth()
@request.restful()
def api():
    response.view = 'generic.'+request.extension
    
    def GET(*args,**vars):
        gFlag = args[0]
        if gFlag == "0":
            uid = args[1]
            data = db(db.events.username == uid).select()
            return json.dumps([{'username': r.username, 'startTime': r.startTime, 'endTime': r.endTime, 'days': r.days} for r in data])

        else:
            interval = int(vars["timeInterval"])
            data = []
            result = []
            for i in range(1, len(args)):
                buf = db(db.events.username == args[i]).select()
                data.extend(list(buf))
            for j in range(0, 7):
                temp = []
                test = []
                for r in data:
                    if(j in r.days):
                        t=[]
                        t.append(r.startTime)
                        t.append(r.endTime)
                        t.append(j)
                        temp.append(t)
                temp.append([700,700,j])
                temp.append([1900,1900,j])
                temp.sort()
#algorithm for merge interval
                last = temp[0]
                for i in range(1, len(temp)):
                    curt = temp[i]
                    if curt[0] <= last[1]:
                        last[1] = max(last[1], curt[1])
                        print(last)
                    else:
                        if (curt[0]/100 - last[1]/100)*60 + (curt[0]%100 - last[1]%100) < interval:
                            last[1] = curt[1]
                        else:
                            test.append(last)
                            last = curt
                test.append(last)
                result.extend(test)
            return json.dumps([{'startTime': r[0], 'endTime': r[1], 'days': [r[2]]} for r in result])



    def POST(*args, **vars):
        uid = args[0]
        dFlag = args[1]
        s = vars["dayStart"]
        t = vars["dayEnd"]
        duration = []
        for i in range (int(s), int(t)+1):
          duration.append(i)
        if dFlag == "1":
            db(db.events.startTime==vars['timeStart'])(db.events.endTime==vars['timeEnd'])(db.events.days==duration).delete()
        if dFlag == "0":
            db.events.insert(username =uid, startTime = vars['timeStart'], endTime = vars['timeEnd'], days = duration)
        return "store data successfully"

    def PUT(table_name,record_id,**vars):
        return db(db[table_name]._id==record_id).update(**vars)
    def DELETE(table_name,record_id):
        return db(db[events].events.id==record_id).delete()
    return dict(GET=GET, POST=POST, PUT=PUT, DELETE=DELETE)
