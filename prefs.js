import Adw from 'gi://Adw';
import Gtk from 'gi://Gtk';

import {
    ExtensionPreferences
} from 'resource:///org/gnome/Shell/Extensions/js/extensions/prefs.js';

const roundToStep = (value, step) => Math.round(value / step) * step;

export default class LayoutOsdPreferences extends ExtensionPreferences {
    fillPreferencesWindow(window) {
        const settings = this.getSettings();
        const page = new Adw.PreferencesPage({
            title: 'Layout OSD',
        });
        const group = new Adw.PreferencesGroup({
            title: 'Popup',
            description: 'Appearance and behaviour',
        });

        page.add(group);
        this._addOpacityRow(group, settings);
        this._addDelayRow(group, settings);
        this._addFadeRow(group, settings);
        this._addPositionRow(group, settings);

        const allMonitors = new Adw.SwitchRow({
            title: 'Show on all monitors',
        });
        allMonitors.set_active(settings.get_boolean('all-monitors'));
        allMonitors.connect('notify::active', row =>
            settings.set_boolean('all-monitors', row.get_active())
        );
        group.add(allMonitors);

        this._addDisplayModeRow(group, settings);
        this._addTestPopupRow(group, settings);

        window.add(page);
    }

    _addOpacityRow(group, settings) {
        const scale = this._createScale({
            lower: 10,
            upper: 100,
            step: 1,
            page: 10,
            value: settings.get_int('opacity'),
        });
        scale.set_format_value_func((scale, value) => `${Math.round(value)} %`);
        this._storeRoundedInt(scale, settings, 'opacity', 1);
        this._addScaleRow(group, 'Opacity', scale);
    }

    _addDelayRow(group, settings) {
        const scale = this._createScale({
            lower: 0.2,
            upper: 3,
            step: 0.1,
            page: 0.5,
            value: settings.get_double('hide-delay'),
        });
        scale.set_digits(1);
        scale.set_format_value_func((scale, value) => `${value.toFixed(1)} s`);
        scale.connect('value-changed', widget =>
            settings.set_double('hide-delay', widget.get_value())
        );
        this._addScaleRow(group, 'Hide delay', scale);
    }

    _addFadeRow(group, settings) {
        const value = roundToStep(settings.get_int('fade-duration'), 10);
        if (settings.get_int('fade-duration') !== value)
            settings.set_int('fade-duration', value);

        const scale = this._createScale({
            lower: 50,
            upper: 1000,
            step: 10,
            page: 100,
            value,
        });
        scale.set_format_value_func((scale, currentValue) =>
            `${roundToStep(currentValue, 10)} ms`
        );
        this._storeRoundedInt(scale, settings, 'fade-duration', 10);
        this._addScaleRow(group, 'Fade duration', scale);
    }

    _addPositionRow(group, settings) {
        const scale = this._createScale({
            lower: 0,
            upper: 100,
            step: 1,
            page: 10,
            value: settings.get_int('vertical-position'),
        });
        scale.set_format_value_func((scale, value) => `${Math.round(value)} %`);
        this._storeRoundedInt(scale, settings, 'vertical-position', 1);
        this._addScaleRow(group, 'Vertical position', scale);
    }

    _addDisplayModeRow(group, settings) {
        const modes = ['short', 'localized', 'full'];
        const model = Gtk.StringList.new([
            'Short (EN)',
            'Localized (English)',
            'Full (English (US))',
        ]);
        const row = new Adw.ComboRow({
            title: 'Layout name',
            model,
            selected: Math.max(0, modes.indexOf(settings.get_string('display-mode'))),
        });

        row.connect('notify::selected', widget =>
            settings.set_string('display-mode', modes[widget.selected])
        );
        group.add(row);
    }

    _addTestPopupRow(group, settings) {
        const row = new Adw.ActionRow({
            title: 'Test popup',
        });
        const button = new Gtk.Button({
            label: 'Test popup',
            valign: Gtk.Align.CENTER,
        });

        // Toggling the key emits a request to the running Shell extension.
        button.connect('clicked', () =>
            settings.set_boolean('test-popup', !settings.get_boolean('test-popup'))
        );

        row.add_suffix(button);
        group.add(row);
    }

    _createScale({lower, upper, step, page, value}) {
        const scale = new Gtk.Scale({
            orientation: Gtk.Orientation.HORIZONTAL,
            adjustment: new Gtk.Adjustment({
                lower,
                upper,
                step_increment: step,
                page_increment: page,
                value,
            }),
            hexpand: true,
            draw_value: true,
            value_pos: Gtk.PositionType.TOP,
        });
        scale.set_digits(0);
        scale.set_round_digits(0);
        return scale;
    }

    _storeRoundedInt(scale, settings, key, step) {
        scale.connect('value-changed', widget => {
            const value = roundToStep(widget.get_value(), step);
            if (widget.get_value() !== value)
                widget.set_value(value);
            if (settings.get_int(key) !== value)
                settings.set_int(key, value);
        });
    }

    _addScaleRow(group, title, scale) {
        const row = new Adw.ActionRow({title});
        row.add_suffix(scale);
        group.add(row);
    }
}
