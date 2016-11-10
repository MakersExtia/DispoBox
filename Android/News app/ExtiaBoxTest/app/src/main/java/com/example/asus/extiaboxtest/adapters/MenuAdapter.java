package com.example.asus.extiaboxtest.adapters;

import android.content.Context;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.BaseAdapter;
import android.widget.ImageView;
import android.widget.TextView;

import com.example.asus.extiaboxtest.R;
import com.example.asus.extiaboxtest.models.MenuData;

import java.util.List;

/**
 * Created by Asus on 03/11/2016.
 */

public class MenuAdapter extends BaseAdapter {

    private Context context;
    private LayoutInflater inflater;
    private List<MenuData> objects;

    public MenuAdapter() {

    }

    public MenuAdapter(Context context, List<MenuData> objects) {
        this.context = context;
        this.inflater = LayoutInflater.from(context);
        this.objects = objects;
    }

    @Override
    public int getCount() {
        return objects == null ? 0 : objects.size();
    }

    @Override
    public MenuData getItem(int position) {
        return objects.get(position);
    }

    @Override
    public long getItemId(int position) {
        return position;
    }

    @Override
    public View getView(final int position, View convertView, ViewGroup parent) {

        ViewHolder holder;
        View rowView = convertView;

        if (convertView == null) {
            holder = new ViewHolder();

            inflater = (LayoutInflater) context.getSystemService(Context.LAYOUT_INFLATER_SERVICE);
            rowView = inflater.inflate(R.layout.item_data_menu, null);

            holder.title = (TextView) rowView.findViewById(R.id.title);
            holder.img = (ImageView) rowView.findViewById(R.id.icon);

            rowView.setTag(holder);
        } else {
            holder = (ViewHolder) rowView.getTag();
        }

        final MenuData obj = getItem(position);
        holder.title.setText(obj.getTitle());
        holder.img.setImageDrawable(obj.getImg());

        return rowView;
    }

    private static class ViewHolder {
        public ImageView img;
        public TextView title;
    }

}
