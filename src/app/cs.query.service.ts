import { Injectable } from '@angular/core';
import { ContentstackService } from '../modules/contentstack/contentstack.service';
import * as Utils from "@contentstack/utils";
import axios from 'axios';
import { Config } from '../environments/environment';

@Injectable({ providedIn: 'root' })
export class ContentstackQueryService {

  constructor(private cs: ContentstackService) { }
  renderOption = {
    ["span"]: (node, next) => {
      return next(node.children);
    },
  }

  onEntryChange(arg0: () => void) {
  }

  getEntry(contentTypeUid: string, references = [], jsonRtePath = []): Promise<any> {

    return this.cs.stack().contentstack.ContentType(contentTypeUid)
      .Query()
      .includeReference(references)
      .toJSON()
      .find()
      .then(entry => {
        jsonRtePath.length > 0 &&
          Utils.jsonToHTML({
            entry,
            paths: jsonRtePath,
            renderOption: this.renderOption,
          });
        return entry;
      }, err => {
        console.log(err, 'err');
      });
  }

  getEntryWithQuery(contentTypeUid: string, { key, value }, references = [], jsonRtePath = []): Promise<any> {
    return this.cs.stack().contentstack.ContentType(contentTypeUid)
      .Query()
      .where(key, value)
      .includeReference(references)
      .toJSON()
      .find()
      .then(entry => {
        jsonRtePath.length > 0 &&
          Utils.jsonToHTML({
            entry,
            paths: jsonRtePath,
            renderOption: this.renderOption,
          });
        return entry;
      }, err => {
        console.log(err, 'err');
      });
  }

  getApiEntry(contentTypeUid: string, { key, value }, references = [], jsonRtePath = [], isLiveUpdate?: boolean, e?: any, entryUid?: any): any {
    const url = `${Config.base_url}/entries`
    let params = {
      contentTypeUid: contentTypeUid,
      key: key,
      value: value,
      references: JSON.stringify(references),
      isLiveUpdate: isLiveUpdate || false
    }     
    if(isLiveUpdate){
      params['event'] = e.data
      params['entryUid'] = entryUid
    }
    return axios.get(url, { params }).then((entry: any) => {
      jsonRtePath.length > 0 &&
        Utils.jsonToHTML({
          entry,
          paths: jsonRtePath,
          renderOption: this.renderOption,
        });
      return [entry.data];
    }).catch(error => {
      console.log("error is",error);
    });
  }
}
