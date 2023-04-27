import { File } from '@gi-types/gio2';
import { MetaInfo, ParamFlags, ParamSpec } from '@gi-types/gobject2';
import { Box, Widget } from '@gi-types/gtk4';
import { getCurrentExtension } from '@gnome-shell/misc/extensionUtils';

import { registerGObject } from '@github-manager/utils/gnome';

import * as PreferencesController from './PreferencesController';

export interface PrefsRowConstructorProperties extends Box.ConstructorProperties {
    label: string;
    description: string;
    widgetType: string;
    widgetParameters: string;
    setting: string;
    prefix: Widget;
    suffix: Widget;
}

@registerGObject
export class PrefsRow extends Box {
    public static readonly metaInfo: MetaInfo = {
        GTypeName: 'PrefsRow',
        Template: File.new_for_path(`${getCurrentExtension().path}/ui/PrefsRow.ui`).get_uri(),
        Properties: {
            label: ParamSpec.string(
                'label',
                'Label',
                'Label for the input widget of this pref',
                ParamFlags.READWRITE,
                ''
            ),
            description: ParamSpec.string(
                'description',
                'Description',
                'Additional information on this pref',
                ParamFlags.READWRITE,
                ''
            ),
            widgetType: ParamSpec.string(
                'widget-type',
                'Type of widget',
                'The widget to use to edit this pref',
                ParamFlags.READWRITE,
                'GktEntry'
            ),
            widgetParameters: ParamSpec.string(
                'widget-parameters',
                'Widget parameters',
                'Additional parameter to build the widget',
                ParamFlags.READWRITE,
                '{}'
            ),
            setting: ParamSpec.string(
                'setting-key',
                'The setting key',
                'The key of the setting controlled by this pref',
                ParamFlags.READWRITE,
                ''
            ),
            prefix: ParamSpec.object(
                'prefix',
                'Prefix widget',
                'Widget at the beginning of the prefs row',
                ParamFlags.READWRITE,
                Widget.$gtype
            ),
            suffix: ParamSpec.object(
                'suffix',
                'Suffix widget',
                'Widget at the end of the prefs row',
                ParamFlags.READWRITE,
                Widget.$gtype
            ),
        },
    };

    private _label: string;
    private _description: string;
    private _widgetType: string;
    private _widgetParameters: string;
    private _settingKey: string;
    private _prefix?: Widget;
    private _suffix?: Widget;

    public constructor(params?: Partial<PrefsRowConstructorProperties>) {
        super(params);

        this._label = params?.label ?? '';
        this._description = params?.description ?? '';
        this._widgetType = params?.widgetType ?? 'GktEntry';
        this._widgetParameters = params?.widgetParameters ?? '{}';
        this._settingKey = params?.setting ?? '';
        this._prefix = params?.prefix;
        this._suffix = params?.suffix;
    }

    public vfunc_realize(): void {
        super.vfunc_realize();

        const widget = PreferencesController.createAndBindWidget(
            this._widgetType,
            this._widgetParameters,
            this._settingKey
        );

        if (this._prefix !== undefined) {
            this.append(this._prefix);
        }

        this.append(widget);

        if (this._suffix !== undefined) {
            this.append(this._suffix);
        }
    }

    public get label(): string {
        return this._label;
    }

    public set label(value: string) {
        if (this._label === value) {
            return;
        }

        this._label = value;
        this.notify('label');
    }

    public get description(): string {
        return this._description;
    }

    public set description(value: string) {
        if (this._description === value) {
            return;
        }

        this._description = value;
        this.notify('description');
    }

    public get widgetType(): string {
        return this._widgetType;
    }

    public set widgetType(value: string) {
        if (this._widgetType === value) {
            return;
        }

        this._widgetType = value;
        this.notify('widget-type');
    }

    public get widgetParameters(): string {
        return this._widgetParameters;
    }

    public set widgetParameters(value: string) {
        if (this._widgetParameters === value) {
            return;
        }

        this._widgetParameters = value;
        this.notify('widget-parameters');
    }

    public get settingKey(): string {
        return this._settingKey;
    }

    public set settingKey(value: string) {
        if (this._settingKey === value) {
            return;
        }

        this._settingKey = value;
        this.notify('setting-key');
    }

    public get prefix(): Widget | undefined {
        return this._prefix;
    }

    public set prefix(value: Widget | undefined) {
        if (this._prefix === value) {
            return;
        }

        this._prefix = value;
        this.notify('prefix');
    }

    public get suffix(): Widget | undefined {
        return this._suffix;
    }

    public set suffix(value: Widget | undefined) {
        if (this._suffix === value) {
            return;
        }

        this._suffix = value;
        this.notify('suffix');
    }
}
